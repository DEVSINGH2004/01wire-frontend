import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import OrderSummary, { creditsText } from "../components/OrderSummary";
import {
  GET_ARTICLE_BY_ID,
  IGetArticleByIdVars,
  IGetArticleById,
} from "graphql/queries/getArticleById";
import { GET_USER_WALLET, IGetUserWallet } from "graphql/queries/getUserWallet";
import {
  UPDATE_ARTICLE_STATUS,
  IUpdateArticleStatusVars,
} from "graphql/mutations/updateArticleStatus";
import {
  PAYMENT_METHODS,
  IPaymentMethods,
  CREATE_RAZORPAY_ORDER,
  ICreateRazorpayOrder,
  VERIFY_RAZORPAY_PAYMENT,
  IVerifyRazorpayPayment,
} from "graphql/mutations/razorpay";
import { clearCart } from "utils/mediaCart";
import { inrText, loadRazorpay } from "utils/razorpay";

const row = (label: string, value: any, bold = false) => (
  <MDBox display="flex" justifyContent="space-between" py={0.75}>
    <MDTypography fontSize="15px" sx={{ color: "#7B809A" }}>
      {label}
    </MDTypography>
    <MDTypography fontSize="15px" fontWeight={bold ? "bold" : "medium"}>
      {value}
    </MDTypography>
  </MDBox>
);

type Method = "CREDITS" | "RAZORPAY";

// Final step of a new order: pay for the plan, then the PR goes to review.
// Methods: 01Wire Credits, or Razorpay (UPI / card / netbanking) for the full
// amount in INR when the server has Razorpay keys. The server confirms a
// Razorpay payment, adds the credits and submits the PR in one go.
function ReleasePayment(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paying, setPaying] = useState<boolean>(false);
  const [method, setMethod] = useState<Method>("CREDITS");
  const { data, loading } = useQuery<IGetArticleById, IGetArticleByIdVars>(GET_ARTICLE_BY_ID, {
    variables: { id },
    fetchPolicy: "network-only",
  });
  const { data: walletData, loading: walletLoading } = useQuery<IGetUserWallet>(GET_USER_WALLET, {
    fetchPolicy: "network-only",
  });
  const { data: methodsData } = useQuery<IPaymentMethods>(PAYMENT_METHODS, {
    fetchPolicy: "network-only",
  });
  const [updateArticleStatus] = useMutation<IUpdateArticleStatusVars>(UPDATE_ARTICLE_STATUS);
  const [createRazorpayOrder] = useMutation<ICreateRazorpayOrder>(CREATE_RAZORPAY_ORDER);
  const [verifyRazorpayPayment] = useMutation<IVerifyRazorpayPayment>(VERIFY_RAZORPAY_PAYMENT);

  const article: any = data?.getArticleById;
  const amount = Number(article?.totalCredits || 0);
  const balance = Number(walletData?.getUserWallet?.balance || 0);
  const shortBy = Math.max(0, amount - balance);
  const hasMedia = article?.bundleIds?.length > 0 || article?.publicationIds?.length > 0;
  const razorpayOn = !!methodsData?.paymentMethods?.razorpay;
  const inrPerCredit = Number(methodsData?.paymentMethods?.inrPerCredit || 0);
  const amountInr = Math.round(amount * inrPerCredit * 100) / 100;
  const byCredits = method === "CREDITS" || !razorpayOn;

  const backToPlan = () => navigate(`/releases/${id}`, { state: { step: 2 } });
  const viewOrder = (paid = false) => navigate(`/releases/${id}`, { state: { step: 3, paid } });

  const paidAndSubmitted = () => {
    clearCart();
    toast.success("Payment successful. Your PR is submitted for review.");
    viewOrder(true);
  };

  const payWithCredits = () => {
    setPaying(true);
    // Submitting debits the credits and creates the orders in one step on the server
    updateArticleStatus({
      variables: { params: { id, status: "SUBMITTED" } },
      refetchQueries: ["getUserWallet"],
    })
      .then(paidAndSubmitted)
      .catch((err: any) => {
        setPaying(false);
        toast.error(err?.message);
      });
  };

  // The server checks the payment with Razorpay, adds the credits and submits the PR
  const confirmRazorpay = (resp: any) => {
    setPaying(true);
    verifyRazorpayPayment({
      variables: {
        params: {
          orderId: resp.razorpay_order_id,
          paymentId: resp.razorpay_payment_id,
          signature: resp.razorpay_signature,
        },
      },
      refetchQueries: ["getUserWallet"],
    })
      .then(({ data: v }) => {
        const r = v.verifyRazorpayPayment;
        if (r.status === "PAID" && r.submitted) {
          paidAndSubmitted();
        } else if (r.status === "PAID") {
          setPaying(false);
          toast.warning(r.message, { autoClose: false });
        } else {
          clearCart();
          toast.info(
            "Payment received and being confirmed. Your PR will be submitted automatically.",
            { autoClose: 8000 }
          );
          navigate("/releases");
        }
      })
      .catch((err: any) => {
        setPaying(false);
        toast.error(
          `${err?.message}. If money was deducted, it will be confirmed automatically in a few minutes.`,
          { autoClose: false }
        );
      });
  };

  const payWithRazorpay = async () => {
    setPaying(true);
    try {
      const [Razorpay, res] = await Promise.all([
        loadRazorpay(),
        createRazorpayOrder({ variables: { articleId: id } }),
      ]);
      const order = res.data.createRazorpayOrder;
      setPaying(false);
      const rzp = new Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "01 Wire",
        description: `PR #${order.prId ?? ""} · ${creditsText(order.credits)}`,
        theme: { color: "#F8303C" },
        handler: confirmRazorpay,
      });
      rzp.on("payment.failed", (r: any) => {
        toast.error(r?.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err: any) {
      setPaying(false);
      toast.error(err?.message);
    }
  };

  const handlePay = () => (byCredits ? payWithCredits() : payWithRazorpay());

  const methodCard = (value: Method, title: string, sub: string) => {
    const on = (value === "CREDITS") === byCredits;
    return (
      <MDBox
        display="flex"
        alignItems="center"
        p={1.5}
        mb={1}
        onClick={() => setMethod(value)}
        sx={{
          cursor: "pointer",
          border: on ? "2px solid #F8303C" : "2px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "8px",
        }}
      >
        <Radio
          checked={on}
          onChange={() => setMethod(value)}
          color="primary"
          inputProps={{ "aria-label": title }}
        />
        <MDBox>
          <MDTypography fontSize="15px" fontWeight="medium">
            {title}
          </MDTypography>
          <MDTypography fontSize="13px" sx={{ color: "#7B809A" }}>
            {sub}
          </MDTypography>
        </MDBox>
      </MDBox>
    );
  };

  const notice = (text: string, action: string, onClick: () => void) => (
    <Card sx={{ p: 3 }}>
      <MDTypography fontSize="16px" mb={2}>
        {text}
      </MDTypography>
      <MDBox>
        <MDButton color="primary" onClick={onClick}>
          {action}
        </MDButton>
      </MDBox>
    </Card>
  );

  let content: JSX.Element;
  if (loading || walletLoading) {
    content = (
      <Card sx={{ minHeight: "300px" }}>
        <MDCircularLoader overlayloader startLoader />
      </Card>
    );
  } else if (!article) {
    content = notice("This PR could not be found.", "Back to Press Releases", () =>
      navigate("/releases")
    );
  } else if (article.status !== "DRAFT") {
    content = notice("This order is already paid.", "View order", () => viewOrder());
  } else if (!hasMedia) {
    content = notice(
      "No media selected yet. Choose a bundle or publications before paying.",
      "Back to Plan & Payment",
      backToPlan
    );
  } else {
    content = (
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <MDTypography variant="h5">Review your order</MDTypography>
            <MDTypography fontSize="15px" mt={0.5} mb={2} sx={{ color: "#7B809A" }}>
              {article.title}
              {article.clientInfo?.title ? ` · ${article.clientInfo.title}` : ""}
            </MDTypography>
            <OrderSummary
              bundles={article.bundleInfo || []}
              publications={article.publicationInfo || []}
              total={amount}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3 }}>
            <MDTypography variant="h5" mb={2}>
              Payment method
            </MDTypography>
            {methodCard("CREDITS", "01Wire Credits", `Balance: ${creditsText(balance)}`)}
            {razorpayOn &&
              methodCard("RAZORPAY", "Razorpay", `UPI, cards, netbanking · ${inrText(amountInr)}`)}
            <MDBox mb={1} />
            {row("Order total", creditsText(amount))}
            {byCredits && row("Credits balance", creditsText(balance))}
            {byCredits &&
              shortBy === 0 &&
              row("Balance after payment", creditsText(balance - amount))}
            {!byCredits && row("Rate", `${inrText(inrPerCredit)} per credit (incl. GST)`)}
            <MDBox my={1.5} sx={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)" }} />
            {row("Payable now", byCredits ? creditsText(amount) : inrText(amountInr), true)}
            {byCredits && shortBy > 0 && (
              <MDBox
                mt={2}
                p={1.5}
                sx={{ background: "#FFF4E5", borderRadius: "8px" }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
                flexWrap="wrap"
              >
                <MDTypography fontSize="14px">
                  You need {creditsText(shortBy)} more to pay for this order
                  {razorpayOn ? ", or pay with Razorpay." : "."}
                </MDTypography>
                <MDButton
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => navigate("/my-credits")}
                >
                  Add Credits
                </MDButton>
              </MDBox>
            )}
            <MDButton
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={(byCredits && shortBy > 0) || paying}
              onClick={handlePay}
            >
              {paying
                ? "Processing..."
                : byCredits
                ? `Pay ${creditsText(amount)}`
                : `Pay ${inrText(amountInr)} with Razorpay`}
            </MDButton>
            <MDTypography fontSize="13px" mt={1} textAlign="center" sx={{ color: "#7B809A" }}>
              Your PR goes to review as soon as the payment is done.
            </MDTypography>
            <MDButton variant="text" color="dark" fullWidth sx={{ mt: 1 }} onClick={backToPlan}>
              Back to Plan & Payment
            </MDButton>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      {paying && <MDCircularLoader overlayloader startLoader />}
      <DashboardNavbar text="Payment" />
      <MDBox px={2} pt={3} pb={3}>
        {content}
      </MDBox>
    </>
  );
}

export default ReleasePayment;

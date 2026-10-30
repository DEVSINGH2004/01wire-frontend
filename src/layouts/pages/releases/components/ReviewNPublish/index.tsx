import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import AddPress from "../AddPress";
import Media from "../Media";
import PlanNPayment from "../PlanNPayment";
import { creditsText } from "../OrderSummary";
import {
  GET_ARTICLE_BY_ID_RNP,
  IGetArticleById,
  IGetArticleByIdVars,
} from "graphql/queries/getArticleByIdNew";

const STATUS_TEXT: Record<string, string> = {
  SUBMITTED: "Submitted for review",
  REVIEW: "In review",
  AWAITING_APPROVAL: "Changes requested",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  REJECTED: "Rejected (credits refunded)",
};

// Shown once the order is paid (any status after Draft)
function PaidReceipt({ article, justPaid }: { article: any; justPaid: boolean }): JSX.Element {
  const row = (label: string, value: any) => (
    <MDBox display="flex" justifyContent="space-between" py={0.5}>
      <MDTypography fontSize="15px" sx={{ color: "#7B809A" }}>
        {label}
      </MDTypography>
      <MDTypography fontSize="15px" fontWeight="medium" textAlign="right">
        {value}
      </MDTypography>
    </MDBox>
  );
  return (
    <MDBox
      mb={3}
      p={2}
      sx={{ border: "1px solid rgba(76, 175, 80, 0.4)", borderRadius: "8px", background: "#F4FBF4" }}
    >
      <MDBox display="flex" alignItems="center" mb={1}>
        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
        <MDTypography variant="h6">{justPaid ? "Payment successful" : "Order paid"}</MDTypography>
      </MDBox>
      {row("Amount paid", creditsText(article?.totalCredits ?? 0))}
      {row("Paid with", "01Wire Credits")}
      {row("Status", STATUS_TEXT[article?.status] || article?.status)}
      {article?.updatedAt && row("Last updated", new Date(article.updatedAt).toLocaleString())}
    </MDBox>
  );
}

function ReviewNPublish({ id }: { id: any }): JSX.Element {
  const location = useLocation();
  const { data, loading } = useQuery<IGetArticleById, IGetArticleByIdVars>(GET_ARTICLE_BY_ID_RNP, {
    fetchPolicy: "network-only",
    variables: {
      id,
    },
    skip: !id,
  });
  return (
    <MDBox>
      {loading ? (
        // Inline, with room to show: an overlay here sits under the stepper
        <MDBox py={8}>
          <MDCircularLoader startLoader />
        </MDBox>
      ) : (
        <>
          {data?.getArticleById && data.getArticleById.status !== "DRAFT" && (
            <PaidReceipt article={data.getArticleById} justPaid={!!location?.state?.paid} />
          )}
          <AddPress data={data?.getArticleById} disabled />
          <Media data={data?.getArticleById} disabled />
          <PlanNPayment data={data?.getArticleById} disabled />
        </>
      )}
    </MDBox>
  );
}

export default ReviewNPublish;

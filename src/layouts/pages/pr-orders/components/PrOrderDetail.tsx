import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ReleasePreview from "layouts/pages/releases/components/ReleasePreview";
import { GET_ARTICLE_BY_ID } from "graphql/queries/getArticleById";
import { UPDATE_ARTICLE_STATUS } from "graphql/mutations/updateArticleStatus";
import { ADMIN_PR_ORDER, IAdminPrRow } from "graphql/queries/adminPrOrders";
import SitesTable from "./SitesTable";
import { AskDialog, INK, MUTED, PR_STATUS, Pill, date, inr, methodLabel } from "./common";

type Action = "AWAITING_APPROVAL" | "SCHEDULED" | "REJECTED" | "PUBLISHED";
const STEPS = ["Paid", "Reviewed", "Accepted", "Sites live", "Published"];

function stepIndex(row: IAdminPrRow): number {
  switch (row.status) {
    case "SUBMITTED": return 0;
    case "REVIEW":
    case "AWAITING_APPROVAL": return 1;
    case "SCHEDULED": return row.pendingCount === 0 && row.liveCount > 0 ? 3 : 2;
    case "PUBLISHED": return 4;
    default: return -1;
  }
}

function Box({ title, children }: { title: string; children: any }): JSX.Element {
  return (
    <Card sx={{ p: 2, height: "100%" }}>
      <MDTypography fontSize="12px" fontWeight="bold" sx={{ color: MUTED, textTransform: "uppercase", mb: 1 }}>{title}</MDTypography>
      {children}
    </Card>
  );
}
const Line = ({ children, muted = false }: { children: any; muted?: boolean }) => (
  <MDTypography fontSize={muted ? "13px" : "15px"} sx={{ color: muted ? MUTED : INK, wordBreak: "break-word" }}>{children}</MDTypography>
);

// One PR: who bought it, how it was paid, where it stands, its sites, the article, and the allowed actions
function PrOrderDetail({ articleId }: { articleId: string }): JSX.Element {
  const navigate = useNavigate();
  const [ask, setAsk] = useState<Action | null>(null);
  const { data, loading, refetch } = useQuery<{ adminPrOrder: IAdminPrRow }>(ADMIN_PR_ORDER, { variables: { articleId }, fetchPolicy: "cache-and-network" });
  const art = useQuery(GET_ARTICLE_BY_ID, { variables: { id: articleId }, fetchPolicy: "cache-and-network" });
  const [setStatus, { loading: saving }] = useMutation(UPDATE_ARTICLE_STATUS);
  const row = data?.adminPrOrder;
  // Opening a new PR marks it "In review" on the server (when the article loads): show that
  useEffect(() => {
    if (art.data && row?.status === "SUBMITTED") refetch();
  }, [art.data]);

  if (loading && !row) return (<><DashboardNavbar /><MDBox p={3}><Card sx={{ minHeight: 300 }}><MDCircularLoader overlayloader startLoader /></Card></MDBox></>);
  if (!row) return (<><DashboardNavbar /><MDBox p={3}><Card sx={{ p: 4 }}><Line>PR not found.</Line></Card></MDBox></>);

  const st = PR_STATUS[row.status] || { label: row.status, color: INK, bg: "#eee" };
  const at = stepIndex(row);
  const s = row.status;
  // Only the actions the server allows right now
  const actions: { key: Action; label: string; variant: "gradient" | "outlined"; color: "primary" | "error" | "success" | "warning" }[] = [];
  if (["SUBMITTED", "REVIEW"].includes(s)) {
    actions.push({ key: "SCHEDULED", label: "Accept & schedule", variant: "gradient", color: "primary" });
    actions.push({ key: "AWAITING_APPROVAL", label: "Ask customer for changes", variant: "outlined", color: "warning" });
  }
  if (s === "SCHEDULED" && row.pendingCount === 0 && row.liveCount > 0) actions.push({ key: "PUBLISHED", label: "Mark PR published", variant: "gradient", color: "success" });
  if (["SUBMITTED", "REVIEW", "AWAITING_APPROVAL", "SCHEDULED"].includes(s) && row.liveCount === 0) {
    actions.push({ key: "REJECTED", label: row.nextStep === "REJECT_PR" ? "Close as rejected" : "Reject whole PR (refund)", variant: "outlined", color: "error" });
  }
  const left = Math.max(0, (row.payment.credits || 0) - (row.payment.refundedCredits || 0));
  const dialog: Record<Action, { title: string; text: string; label?: string; placeholder?: string; confirm: string; danger?: boolean }> = {
    SCHEDULED: { title: "Accept this PR?", text: "You can then publish each site and add its live link.", confirm: "Accept & schedule" },
    AWAITING_APPROVAL: { title: "Ask the customer for changes", text: "The customer sees your message, edits the PR and sends it again (no new payment).", label: "What should they change?", placeholder: "e.g. Please add a company quote and a higher-quality image", confirm: "Send to customer" },
    REJECTED: { title: "Reject the whole PR", text: left > 0 ? `${left} credits go back to the customer's wallet. The reason is shown to them.` : "Nothing is left to refund (sites were already refunded). The reason is shown to the customer.", label: "Reason", placeholder: "e.g. Topic not allowed on these sites", confirm: "Reject PR", danger: true },
    PUBLISHED: { title: "Mark the PR as published?", text: `${row.liveCount} of ${row.totalCount} sites are live${row.rejectedCount ? `, ${row.rejectedCount} rejected and refunded` : ""}. The customer sees the PR as Published.`, confirm: "Mark published" },
  };

  const run = (value: string) => {
    if (!ask) return;
    setStatus({ variables: { params: { id: row.articleId, status: ask, ...(value ? { notes: value } : {}) } } })
      .then(() => { toast.success(`PR #${row.prId}: ${PR_STATUS[ask]?.label || ask}`); setAsk(null); refetch(); art.refetch(); })
      .catch((e) => toast.error(e?.message || "Could not update the PR"));
  };

  return (
    <>
      <DashboardNavbar />
      <MDBox px={2} pb={4}>
        <MDBox display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} mt={1} mb={2}>
          <MDBox display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
            <MDButton size="small" variant="text" color="secondary" onClick={() => navigate(-1)}>← Back</MDButton>
            <MDTypography variant="h5" sx={{ color: INK }}>PR #{row.prId}</MDTypography>
            <Pill {...st} />
          </MDBox>
          <MDBox display="flex" gap={1} flexWrap="wrap" data-testid="pr-actions">
            {actions.map((a) => (
              <MDButton key={a.key + a.label} size="small" variant={a.variant} color={a.color} onClick={() => setAsk(a.key)}>{a.label}</MDButton>
            ))}
          </MDBox>
        </MDBox>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box title="Customer">
              <Line>{row.customerName || "—"}</Line>
              <Line muted>{row.customerEmail}</Line>
              <MDBox mt={1}><Line muted>Client</Line><Line>{row.clientName || "—"}</Line></MDBox>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box title="Payment">
              <Line>{row.payment.credits ?? "—"} credits{row.payment.amount ? ` · ${inr(row.payment.amount)}` : ""}</Line>
              <Line muted>
                {methodLabel(row.payment.method)}{row.payment.gatewayRef ? ` ${row.payment.gatewayRef}` : ""}{row.payment.test ? " · TEST" : ""}
              </Line>
              <Line muted>{row.payment.paidAt ? `Paid ${date(row.payment.paidAt, true)}` : "Not paid yet"}</Line>
              {row.payment.refundedCredits > 0 && <Line muted>{row.payment.refundedCredits} credits refunded for rejected sites</Line>}
              {row.payment.issue && <MDTypography fontSize="13px" sx={{ color: "#b26a00", fontWeight: 700, mt: 0.5 }}>⚠ {row.payment.issue}</MDTypography>}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box title="Progress">
              {at < 0 ? (
                <Line>{row.status === "REJECTED" ? `Rejected${row.notes ? `: ${row.notes}` : ""}` : "Not paid yet"}</Line>
              ) : (
                <MDBox display="flex" flexDirection="column" gap={0.5}>
                  {STEPS.map((label, i) => (
                    <MDBox key={label} display="flex" alignItems="center" gap={1}>
                      <MDBox sx={{ width: 10, height: 10, borderRadius: "50%", background: i <= at ? "#43a047" : "#cfd8dc" }} />
                      <MDTypography fontSize="14px" sx={{ color: i <= at ? INK : MUTED, fontWeight: i === at ? 700 : 400 }}>
                        {label}{label === "Sites live" ? ` (${row.liveCount}/${row.totalCount})` : ""}
                      </MDTypography>
                    </MDBox>
                  ))}
                </MDBox>
              )}
              {row.status === "AWAITING_APPROVAL" && row.notes && <MDTypography fontSize="13px" sx={{ color: "#b26a00", mt: 1 }}>Asked: {row.notes}</MDTypography>}
            </Box>
          </Grid>
        </Grid>

        <Card sx={{ mt: 2 }}>
          <MDBox px={2} pt={2}>
            <MDTypography variant="h6" sx={{ color: INK }}>Sites in this PR</MDTypography>
            {row.status !== "SCHEDULED" && row.pendingCount > 0 && (
              <Line muted>Accept the PR first; then you can publish or reject each site here.</Line>
            )}
          </MDBox>
          <MDBox p={1}><SitesTable row={row} onChanged={() => refetch()} /></MDBox>
        </Card>

        <Card sx={{ mt: 2, p: { xs: 2, md: 4 } }}>
          <MDTypography variant="h6" sx={{ color: INK, mb: 1 }}>The article</MDTypography>
          {art.data?.getArticleById ? <ReleasePreview article={art.data.getArticleById} /> : <Line muted>Loading…</Line>}
        </Card>
      </MDBox>

      {ask && (
        <AskDialog
          open={!!ask}
          title={dialog[ask].title}
          text={dialog[ask].text}
          label={dialog[ask].label}
          placeholder={dialog[ask].placeholder}
          danger={dialog[ask].danger}
          confirm={saving ? "Saving…" : dialog[ask].confirm}
          onClose={() => setAsk(null)}
          onConfirm={run}
        />
      )}
    </>
  );
}

export default PrOrderDetail;

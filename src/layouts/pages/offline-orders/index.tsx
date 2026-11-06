import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Link from "@mui/material/Link";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {
  IMPORT_OFFLINE_ORDERS,
  IOfflineImportResult,
  IOfflineOrder,
  IOfflineOrders,
  OFFLINE_ORDERS,
  UNDO_OFFLINE_IMPORT,
  UPDATE_OFFLINE_ORDER,
} from "graphql/queries/offlineOrders";

const INK = "#344767";
const MUTED = "#7b809a";
const RED = "#b71c1c";
const GREEN = "#1b5e20";
const rupees = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const day = (d: string | null) => (d ? dayjs(d).format("DD MMM YYYY") : "—");
const host = (u: string) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
};
const monthLabel = (m: string) => dayjs(`${m}-01`).format("MMMM YYYY");
const cell = { borderBottom: "1px solid rgba(0,0,0,0.06)", py: 1.25, px: 1.25, fontSize: "13px", color: INK, verticalAlign: "top" };
const head = { ...cell, fontWeight: 700, color: MUTED, fontSize: "11px", textTransform: "uppercase" as const, verticalAlign: "middle" };

const Pill = ({ label, good }: { label: string; good: boolean }) => (
  <MDBox component="span" sx={{ display: "inline-block", px: 1, py: 0.25, borderRadius: "999px", fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap", color: good ? GREEN : RED, background: good ? "#e8f5e9" : "#ffebee" }}>
    {label}
  </MDBox>
);

function Total({ label, value, note, color = INK }: { label: string; value: string | number; note?: string; color?: string }) {
  return (
    <Card sx={{ p: 2, height: "100%" }}>
      <MDTypography fontSize="12px" fontWeight="medium" sx={{ color: MUTED }}>{label}</MDTypography>
      <MDTypography fontSize="22px" fontWeight="bold" sx={{ color, mt: 0.5 }}>{value}</MDTypography>
      {note && <MDTypography fontSize="12px" sx={{ color: MUTED }}>{note}</MDTypography>}
    </Card>
  );
}

// Admin-only: orders taken outside the dashboard (WhatsApp groups), imported from the monthly sheet
function OfflineOrders(): JSX.Element {
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [status, setStatus] = useState("");
  const [vendorPaid, setVendorPaid] = useState("");
  const [vendor, setVendor] = useState("");
  const [group, setGroup] = useState("");
  const [typed, setTyped] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<IOfflineOrder | null>(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSearch(typed.trim()), 300);
    return () => clearTimeout(t);
  }, [typed]);

  const { data, loading, refetch } = useQuery<IOfflineOrders>(OFFLINE_ORDERS, {
    variables: { filterInput: { month, status: status || undefined, vendorPaymentStatus: vendorPaid || undefined, vendor: vendor || undefined, customerGroup: group || undefined, search: search || undefined } },
    fetchPolicy: "cache-and-network",
  });
  const list = data?.offlineOrders;
  const rows = list?.data || [];
  const t = list?.totals;
  const filtered = !!(status || vendorPaid || vendor || group || search);

  const downloadCsv = () => {
    const cols = ["Date", "Customer", "Site / package", "Status", "Delivered on", "Live links", "Paid (₹)", "Vendor", "Vendor cost (₹)", "Margin (₹)", "Vendor paid", "Vendor payment note", "Article", "Notes"];
    const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = rows.map((o) =>
      [day(o.orderDate), o.customerGroup, o.item, o.status === "DELIVERED" ? "Delivered" : "Not delivered", day(o.deliveredAt), (o.liveLinks || []).join(" ") || o.liveNote || "", o.amountPaid, o.vendor, o.vendorCost, o.margin, o.vendorPaymentStatus === "PAID" ? "Paid" : "Unpaid", o.vendorPaymentNote, o.articleLink || o.articleNote, o.notes].map(esc).join(",")
    );
    const blob = new Blob(["﻿" + [cols.map(esc).join(","), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `offline-orders-${month}${filtered ? "-filtered" : ""}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <MDBox>
      <DashboardNavbar />
      <MDBox px={2} pb={4}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5} mt={1}>
          <MDBox>
            <MDTypography variant="h4" sx={{ color: INK }}>Offline Orders</MDTypography>
            <MDTypography fontSize="13px" sx={{ color: MUTED }}>Orders taken outside the dashboard, imported from the monthly sheet. Admin only.</MDTypography>
          </MDBox>
          <MDBox display="flex" gap={1} alignItems="center" flexWrap="wrap">
            <TextField size="small" type="month" label="Month" InputLabelProps={{ shrink: true }} value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} inputProps={{ "data-testid": "month-input" }} sx={{ background: "#fff", borderRadius: "8px" }} />
            <MDButton size="small" variant="gradient" color="primary" onClick={() => setImporting(true)}>Import sheet</MDButton>
            <MDButton size="small" variant="outlined" color="primary" disabled={!rows.length} onClick={downloadCsv}>Download (Excel)</MDButton>
          </MDBox>
        </MDBox>

        <Grid container spacing={2} mt={0.5} data-testid="offline-totals">
          <Grid item xs={6} md={4} lg={2}><Total label="Orders" value={t?.count ?? "—"} note={t ? `${t.delivered} delivered · ${t.notDelivered} not` : undefined} /></Grid>
          <Grid item xs={6} md={4} lg={2.5}><Total label="Customers paid" value={t ? rupees(t.paid) : "—"} /></Grid>
          <Grid item xs={6} md={4} lg={2.5}><Total label="Vendor cost" value={t ? rupees(t.vendorCost) : "—"} /></Grid>
          <Grid item xs={6} md={6} lg={2.5}><Total label="Margin" value={t ? rupees(t.margin) : "—"} note={t && t.paid ? `${Math.round((t.margin / t.paid) * 100)}% of what customers paid` : undefined} color={GREEN} /></Grid>
          <Grid item xs={12} md={6} lg={2.5}><Total label="Owed to vendors" value={t ? rupees(t.owedToVendors) : "—"} note={t ? `${t.owedCount} ${t.owedCount === 1 ? "order" : "orders"} not paid yet` : undefined} color={t?.owedToVendors ? RED : INK} /></Grid>
        </Grid>

        <Card sx={{ mt: 2 }}>
          <MDBox p={2} display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
            <TextField size="small" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Search customer, site, vendor, notes" sx={{ flex: "1 1 240px" }} inputProps={{ "aria-label": "Search offline orders" }} />
            {[
              ["Status", status, setStatus, [["DELIVERED", "Delivered"], ["NOT_DELIVERED", "Not delivered"]]],
              ["Vendor paid", vendorPaid, setVendorPaid, [["PAID", "Paid"], ["UNPAID", "Unpaid"]]],
              ["Vendor", vendor, setVendor, (list?.vendors || []).map((v) => [v, v])],
              ["Customer", group, setGroup, (list?.groups || []).map((v) => [v, v])],
            ].map(([label, value, set, opts]: any) => (
              <TextField key={label} select size="small" label={label} value={value} onChange={(e) => set(e.target.value)} sx={{ minWidth: 150, "& .MuiInputBase-root": { height: 40 } }}>
                <MenuItem value="">All</MenuItem>
                {opts.map(([v, l]: string[]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
              </TextField>
            ))}
            {filtered && <MDButton size="small" variant="text" color="secondary" onClick={() => { setStatus(""); setVendorPaid(""); setVendor(""); setGroup(""); setTyped(""); }}>Clear</MDButton>}
          </MDBox>
          <MDBox sx={{ overflowX: "auto", position: "relative", minHeight: 120 }}>
            {loading && !data && <MDCircularLoader overlayloader startLoader />}
            <Table sx={{ minWidth: 1150 }} data-testid="offline-table">
              <TableHead sx={{ display: "table-header-group" }}>
                <TableRow>
                  {["Date", "Customer", "Site / package", "Status", "Delivered on", "Live link", "Paid", "Vendor", "Vendor cost", "Margin", "Vendor paid"].map((h) => <TableCell key={h} sx={head}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((o) => (
                  <TableRow key={o.id} hover onClick={() => setOpen(o)} sx={{ cursor: "pointer" }} data-testid="offline-row">
                    <TableCell sx={{ ...cell, whiteSpace: "nowrap" }}>{day(o.orderDate)}</TableCell>
                    <TableCell sx={{ ...cell, fontWeight: 600 }}>{o.customerGroup}</TableCell>
                    <TableCell sx={{ ...cell, maxWidth: 220, wordBreak: "break-word" }}>{o.item}</TableCell>
                    <TableCell sx={cell}><Pill label={o.status === "DELIVERED" ? "Delivered" : "Not delivered"} good={o.status === "DELIVERED"} /></TableCell>
                    <TableCell sx={{ ...cell, whiteSpace: "nowrap" }}>{day(o.deliveredAt)}</TableCell>
                    <TableCell sx={{ ...cell, maxWidth: 180 }} onClick={(e) => e.stopPropagation()}>
                      {o.liveLinks?.length ? (
                        <>
                          <Link href={o.liveLinks[0]} target="_blank" rel="noopener noreferrer" sx={{ fontSize: "13px", color: "#1A73E8" }}>{host(o.liveLinks[0])}</Link>
                          {o.liveLinks.length > 1 && <MDTypography fontSize="12px" sx={{ color: MUTED }}>+{o.liveLinks.length - 1} more</MDTypography>}
                        </>
                      ) : (
                        <MDTypography fontSize="12px" sx={{ color: MUTED }}>{o.liveNote || "—"}</MDTypography>
                      )}
                    </TableCell>
                    <TableCell sx={{ ...cell, whiteSpace: "nowrap", fontWeight: 600 }}>{rupees(o.amountPaid)}</TableCell>
                    <TableCell sx={{ ...cell, maxWidth: 170 }}>{o.vendor || "—"}</TableCell>
                    <TableCell sx={{ ...cell, whiteSpace: "nowrap" }}>{rupees(o.vendorCost)}</TableCell>
                    <TableCell sx={{ ...cell, whiteSpace: "nowrap", color: o.margin >= 0 ? GREEN : RED }}>{rupees(o.margin)}</TableCell>
                    <TableCell sx={cell}><Pill label={o.vendorPaymentStatus === "PAID" ? "Paid" : "Unpaid"} good={o.vendorPaymentStatus === "PAID"} /></TableCell>
                  </TableRow>
                ))}
                {!loading && !rows.length && (
                  <TableRow>
                    <TableCell colSpan={11} sx={{ ...cell, textAlign: "center", py: 6, color: MUTED }}>
                      {filtered ? "No orders match these filters." : `No offline orders for ${monthLabel(month)}. Use "Import sheet" to add the month's sheet.`}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </MDBox>
        </Card>
      </MDBox>

      {open && <OrderDialog order={open} onClose={() => setOpen(null)} onSaved={() => refetch()} />}
      {importing && <ImportDialog onClose={() => setImporting(false)} onDone={(m) => { setImporting(false); if (m) setMonth(m); refetch(); }} />}
    </MDBox>
  );
}

// One order: everything from the sheet, plus status / live link / vendor paid / notes to update
function OrderDialog({ order, onClose, onSaved }: { order: IOfflineOrder; onClose: () => void; onSaved: () => void }) {
  const [status, setStatus] = useState(order.status);
  const [vendorPaid, setVendorPaid] = useState(order.vendorPaymentStatus);
  const [liveLink, setLiveLink] = useState("");
  const [notes, setNotes] = useState(order.notes || "");
  const [save, { loading }] = useMutation(UPDATE_OFFLINE_ORDER);
  const row = (label: string, value: any) => (
    <MDBox display="flex" gap={2} py={0.5} sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
      <MDTypography fontSize="13px" sx={{ color: MUTED, minWidth: 140 }}>{label}</MDTypography>
      <MDTypography component="div" fontSize="13px" sx={{ color: INK, wordBreak: "break-word" }}>{value || "—"}</MDTypography>
    </MDBox>
  );
  const submit = () => {
    const params: any = { id: order.id };
    if (status !== order.status) params.status = status;
    if (vendorPaid !== order.vendorPaymentStatus) params.vendorPaymentStatus = vendorPaid;
    if (liveLink.trim()) params.liveLink = liveLink.trim();
    if ((notes || "") !== (order.notes || "")) params.notes = notes;
    if (Object.keys(params).length === 1) return onClose();
    save({ variables: { params } })
      .then(() => { toast.success("Order updated"); onSaved(); onClose(); })
      .catch((e) => toast.error(e?.message || "Could not save"));
  };
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ color: INK }}>{order.customerGroup} · {order.item}</DialogTitle>
      <DialogContent>
        {row("Order date", day(order.orderDate))}
        {row("Customer paid", `${rupees(order.amountPaid)} · ${order.customerPaymentStatus === "PAID" ? "Paid" : "Unpaid"}`)}
        {row("Article", order.articleLink ? <Link href={order.articleLink} target="_blank" rel="noopener noreferrer" sx={{ color: "#1A73E8" }}>Open doc</Link> : order.articleNote)}
        {row("Delivered on", day(order.deliveredAt))}
        {row("Live links", order.liveLinks?.length ? order.liveLinks.map((l) => <MDBox key={l}><Link href={l} target="_blank" rel="noopener noreferrer" sx={{ color: "#1A73E8", fontSize: "13px" }}>{l}</Link></MDBox>) : order.liveNote)}
        {row("Vendor", order.vendor)}
        {row("Vendor cost / margin", `${rupees(order.vendorCost)} · margin ${rupees(order.margin)}`)}
        {row("Vendor delivered", order.vendorOrderStatus === "DELIVERED" ? "Delivered" : order.vendorOrderStatus === "NOT_DELIVERED" ? "Not delivered" : "—")}
        {row("Vendor payment note", order.vendorPaymentNote)}
        {row("From", `Import ${order.importBatch}${order.sourceRow ? ` · sheet row ${order.sourceRow}` : ""}`)}
        <MDTypography variant="h6" sx={{ color: INK, mt: 2 }}>Update</MDTypography>
        <Grid container spacing={2} mt={0}>
          <Grid item xs={12} sm={4}>
            <TextField select fullWidth size="small" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="DELIVERED">Delivered</MenuItem>
              <MenuItem value="NOT_DELIVERED">Not delivered</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField select fullWidth size="small" label="Vendor paid" value={vendorPaid} onChange={(e) => setVendorPaid(e.target.value)} inputProps={{ "data-testid": "vendor-paid" }}>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="UNPAID">Unpaid</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="Add a live link" placeholder="https://…" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth size="small" label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} multiline minRows={2} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <MDButton size="small" variant="outlined" color="secondary" onClick={onClose}>Close</MDButton>
        <MDButton size="small" variant="gradient" color="primary" onClick={submit}>{loading ? "Saving…" : "Save"}</MDButton>
      </DialogActions>
    </Dialog>
  );
}

// Choose the .xlsx -> preview (nothing saved) -> Apply. Also undo an earlier import.
function ImportDialog({ onClose, onDone }: { onClose: () => void; onDone: (month?: string) => void }) {
  const [file, setFile] = useState<{ name: string; b64: string } | null>(null);
  const [preview, setPreview] = useState<IOfflineImportResult | null>(null);
  const [run, { loading }] = useMutation<{ importOfflineOrders: IOfflineImportResult }>(IMPORT_OFFLINE_ORDERS);
  const [undo, { loading: undoing }] = useMutation(UNDO_OFFLINE_IMPORT);
  const [undoBatch, setUndoBatch] = useState("");

  const pick = (f?: File) => {
    setPreview(null);
    if (!f) return setFile(null);
    if (!/\.xlsx$/i.test(f.name)) return toast.error("Choose an Excel .xlsx file");
    const r = new FileReader();
    r.onload = () => setFile({ name: f.name, b64: String(r.result).split(",")[1] || "" });
    r.readAsDataURL(f);
  };
  const go = (dryRun: boolean) =>
    run({ variables: { fileBase64: file?.b64, dryRun } })
      .then(({ data }) => {
        const res = data?.importOfflineOrders;
        if (!res) return;
        if (dryRun) { setPreview(res); setUndoBatch(res.importBatch); return; }
        toast.success(`${res.toAdd} ${res.toAdd === 1 ? "order" : "orders"} imported (${res.importBatch})`);
        onDone(res.importBatch);
      })
      .catch((e) => toast.error(e?.message || "Import failed"));
  const doUndo = () => {
    if (!/^\d{4}-\d{2}$/.test(undoBatch)) return toast.error("Enter the import to undo, e.g. 2026-10");
    if (!window.confirm(`Remove every order imported as "${undoBatch}"? You can import the sheet again afterwards.`)) return;
    undo({ variables: { importBatch: undoBatch } })
      .then(({ data }) => { toast.success(`${data?.undoOfflineImport ?? 0} orders removed from import ${undoBatch}`); onDone(); })
      .catch((e) => toast.error(e?.message || "Could not undo"));
  };
  const p = preview;
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ color: INK }}>Import the monthly orders sheet</DialogTitle>
      <DialogContent>
        <MDTypography fontSize="13px" sx={{ color: MUTED, mb: 1.5 }}>
          Columns used: Date, Group Name, docs_link, Order, Payment, Publications, Payment Status, Order status, Delivery Date, Live link, We gave order to, For, Provider Payment Status, Provider Order status, Payment Link, Notes. Empty rows are skipped; orders already imported are never added twice.
        </MDTypography>
        <MDBox component="label" sx={{ display: "inline-block" }}>
          <input type="file" accept=".xlsx" data-testid="import-file" onChange={(e) => pick(e.target.files?.[0])} />
        </MDBox>
        {loading && <MDTypography fontSize="13px" sx={{ color: MUTED, mt: 1 }}>Reading the sheet…</MDTypography>}
        {p && (
          <MDBox mt={2} data-testid="import-preview">
            <MDTypography variant="h6" sx={{ color: INK }}>Preview: nothing is saved yet</MDTypography>
            <MDTypography fontSize="14px" sx={{ color: INK, mt: 0.5 }}>
              <b>{p.toAdd}</b> {p.toAdd === 1 ? "order" : "orders"} to add · {p.alreadyImported} already imported · <span style={{ color: p.errors.length ? RED : INK }}>{p.errors.length} with errors</span> · import name <b>{p.importBatch}</b>
            </MDTypography>
            <MDTypography fontSize="14px" sx={{ color: INK }}>Customers paid {rupees(p.paid)} · vendor cost {rupees(p.vendorCost)}</MDTypography>
            {p.months.map((m) => (
              <MDTypography key={m.month} fontSize="13px" sx={{ color: MUTED }}>{monthLabel(m.month)}: {m.count} {m.count === 1 ? "order" : "orders"} · {rupees(m.paid)} paid · {rupees(m.vendorCost)} vendor cost</MDTypography>
            ))}
            {p.errors.length > 0 && (
              <MDBox mt={1.5}>
                <MDTypography fontSize="13px" fontWeight="bold" sx={{ color: RED }}>Not imported</MDTypography>
                {p.errors.map((x) => <MDTypography key={`e${x.row}`} fontSize="12px" sx={{ color: RED }}>Row {x.row}: {x.reason}</MDTypography>)}
              </MDBox>
            )}
            {p.warnings.length > 0 && (
              <MDBox mt={1.5}>
                <MDTypography fontSize="13px" fontWeight="bold" sx={{ color: "#b26a00" }}>Please check</MDTypography>
                {p.warnings.map((x, i) => <MDTypography key={`w${i}`} fontSize="12px" sx={{ color: "#8a5a00" }}>Row {x.row}: {x.reason}</MDTypography>)}
              </MDBox>
            )}
          </MDBox>
        )}
        <MDBox mt={3} pt={2} sx={{ borderTop: "1px solid rgba(0,0,0,0.08)" }} display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
          <MDTypography fontSize="13px" sx={{ color: MUTED }}>Undo an earlier import:</MDTypography>
          <TextField size="small" placeholder="2026-10" value={undoBatch} onChange={(e) => setUndoBatch(e.target.value)} sx={{ width: 120 }} />
          <MDButton size="small" variant="text" color="error" onClick={doUndo}>{undoing ? "Removing…" : "Undo import"}</MDButton>
        </MDBox>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <MDButton size="small" variant="outlined" color="secondary" onClick={onClose}>Close</MDButton>
        <MDButton size="small" variant="outlined" color="primary" disabled={!file || loading} onClick={() => go(true)}>Preview</MDButton>
        <MDButton size="small" variant="gradient" color="primary" disabled={!p || !p.toAdd || loading} onClick={() => go(false)}>
          {p ? `Apply: add ${p.toAdd} ${p.toAdd === 1 ? "order" : "orders"}` : "Apply"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default OfflineOrders;

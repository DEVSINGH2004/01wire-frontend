import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CloseIcon from "@mui/icons-material/Close";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { GET_BUNDLES, IGetBundles, IGetBundlesVars } from "graphql/queries/filterBundlesPaginated";
import { getImageUrl } from "utils/apiConfig";
import { BundleCategoryOptions } from "constants/index";
import { bundleName, creditsText } from "layouts/pages/releases/components/OrderSummary";

// Bundles tab of the Marketplace: ready-made sets of publications at one price.
// "Add" puts the bundle in the same media cart as single publications.

const MUTED = "#7B809A";
const INK = "#344767";
const GREEN = "#2E7D32";
const dash = (v: any) => (v === null || v === undefined || v === "" || v === 0 ? "-" : v);
const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url || "";
  }
};
const linkText = (t: string) => (t === "DO_FOLLOW" ? "Do-follow" : t === "NO_FOLLOW" ? "No-follow" : "-");
const worthOf = (b: any) => (b?.publicationInfo || []).reduce((acc: number, p: any) => acc + (Number(p?.price) || 0), 0);
// Strip the "Sample bundle · …:" lead-in and the site list (shown separately) from the description
const blurb = (b: any) => {
  const d: string = b?.description || "";
  const m = d.match(/^(?:Sample bundle · )?([^:]+):.*?\)\.\s*(.*)$/);
  return m ? `${m[1]}. ${m[2]}` : d;
};

function Logo({ p, size = 28 }: { p: any; size?: number }): JSX.Element {
  const src = getImageUrl(p?.image);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const box = { width: size, height: size, minWidth: size, borderRadius: "8px", border: "2px solid #fff", boxSizing: "border-box" as const };
  if (src && !failed) {
    return (
      <MDBox component="img" src={src} alt={`${p?.title} logo`} loading="lazy" onError={() => setFailed(true)} sx={{ ...box, objectFit: "contain", background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.1)" }} />
    );
  }
  return (
    <MDBox display="flex" alignItems="center" justifyContent="center" sx={{ ...box, background: "#E9ECEF", color: INK, fontWeight: 700, fontSize: size * 0.4 }}>
      {(p?.title || "?").replace(/^https?:\/\//, "")[0]?.toUpperCase()}
    </MDBox>
  );
}

// What the cart keeps for a bundle (OrderSummary / PR form read these fields)
const toCartBundle = (b: any) => ({ id: b.id, type: b.type, category: b.category, price: b.price, publicationIds: b.publicationIds });

interface Props {
  isPhone: boolean;
  bundles: any[];
  setBundles: (fn: (prev: any[]) => any[]) => void;
}

function BundlesTab({ isPhone, bundles, setBundles }: Props): JSX.Element {
  const { data, loading, error, refetch } = useQuery<IGetBundles, IGetBundlesVars>(GET_BUNDLES, {
    variables: { paginationInput: { currentPage: 0, perPage: 100 } },
    fetchPolicy: "cache-and-network",
  });
  const [category, setCategory] = useState<string>("ALL");
  const [details, setDetails] = useState<any>(null);
  const all = useMemo(
    () =>
      (data?.filterBundlesPaginated?.data || [])
        .filter((b: any) => b?.visibility === "PUBLISHED")
        .sort((a: any, b: any) => a.category.localeCompare(b.category) || a.price - b.price),
    [data]
  );
  const list = category === "ALL" ? all : all.filter((b: any) => b.category === category);
  const addedIds = useMemo(() => new Set(bundles.map((b) => b?.id)), [bundles]);
  const toggle = (b: any) =>
    setBundles((prev) => (prev.some((x) => x?.id === b.id) ? prev.filter((x) => x?.id !== b.id) : [...prev, toCartBundle(b)]));

  if (loading && !data) {
    return (
      <Card sx={{ p: 3 }}>
        <MDTypography fontSize="15px" sx={{ color: MUTED }}>
          Loading bundles…
        </MDTypography>
      </Card>
    );
  }
  if (error && !data) {
    return (
      <Card sx={{ p: 3 }}>
        <MDTypography fontSize="15px" sx={{ color: INK }}>
          Could not load bundles. Check your connection and try again.
        </MDTypography>
        <MDButton color="primary" size="small" sx={{ mt: 1.5 }} onClick={() => refetch()}>
          Try again
        </MDButton>
      </Card>
    );
  }

  const categories = BundleCategoryOptions.filter((c) => all.some((b: any) => b.category === c.value));

  return (
    <>
      <MDBox display="flex" alignItems="center" gap={1} mb={2} flexWrap="wrap">
        {[{ label: "All", value: "ALL" }, ...categories].map((c) => (
          <Chip
            key={c.value}
            label={c.label}
            color={category === c.value ? "primary" : "default"}
            variant={category === c.value ? "filled" : "outlined"}
            onClick={() => setCategory(c.value)}
          />
        ))}
        <MDTypography fontSize="14px" sx={{ color: MUTED, ml: 1 }}>
          {list.length} {list.length === 1 ? "bundle" : "bundles"}
        </MDTypography>
      </MDBox>
      {!list.length && (
        <Card sx={{ p: 3 }}>
          <MDTypography fontSize="15px" sx={{ color: MUTED }}>
            No bundles are available right now.
          </MDTypography>
        </Card>
      )}
      <MDBox display="grid" gridTemplateColumns={isPhone ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))"} gap={2}>
        {list.map((b: any) => {
          const on = addedIds.has(b.id);
          const worth = worthOf(b);
          const save = worth > b.price ? worth - b.price : 0;
          const pubs = b.publicationInfo || [];
          return (
            <Card key={b.id} data-testid="bundle-card" sx={{ p: 2.5, display: "flex", flexDirection: "column", border: on ? `2px solid ${GREEN}` : "2px solid transparent" }}>
              <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                <MDTypography fontSize="17px" fontWeight="bold" sx={{ color: INK }}>
                  {bundleName(b)}
                </MDTypography>
                {save > 0 && (
                  <Chip size="small" label={`Save ${Math.round((save / worth) * 100)}%`} sx={{ background: "#E8F5E9", color: GREEN, fontWeight: 600 }} />
                )}
              </MDBox>
              <MDTypography fontSize="13px" sx={{ color: MUTED, mt: 0.5 }}>
                {pubs.length} publications
              </MDTypography>
              <MDBox display="flex" mt={1.5} sx={{ "& > *:not(:first-of-type)": { ml: "-6px" } }}>
                {pubs.slice(0, 6).map((p: any) => (
                  <Logo key={p.id} p={p} />
                ))}
              </MDBox>
              <MDTypography fontSize="13px" sx={{ color: INK, mt: 1.25, lineHeight: 1.45 }}>
                {pubs.map((p: any) => p.title).join(", ")}
              </MDTypography>
              {b.description && (
                <MDTypography fontSize="12px" sx={{ color: MUTED, mt: 0.75, lineHeight: 1.4 }}>
                  {blurb(b)}
                </MDTypography>
              )}
              <MDBox flexGrow={1} />
              <MDBox display="flex" alignItems="baseline" gap={1} mt={2}>
                <MDTypography fontSize="20px" fontWeight="bold" color="primary">
                  {creditsText(b.price)}
                </MDTypography>
                {save > 0 && (
                  <MDTypography fontSize="14px" sx={{ color: MUTED, textDecoration: "line-through" }}>
                    {creditsText(worth)}
                  </MDTypography>
                )}
              </MDBox>
              <MDTypography fontSize="11px" sx={{ color: MUTED }}>
                incl. GST
              </MDTypography>
              <MDBox display="flex" gap={1} mt={1.5}>
                <MDButton
                  color={on ? "success" : "primary"}
                  variant={on ? "outlined" : "contained"}
                  size="small"
                  fullWidth
                  onClick={() => toggle(b)}
                  aria-pressed={on}
                  aria-label={on ? `Remove ${bundleName(b)}` : `Add ${bundleName(b)}`}
                >
                  {on ? "Added ✓" : "Add"}
                </MDButton>
                <MDButton variant="outlined" color="primary" size="small" fullWidth onClick={() => setDetails(b)}>
                  Details
                </MDButton>
              </MDBox>
            </Card>
          );
        })}
      </MDBox>
      {details && (
        <BundleDetails bundle={details} isPhone={isPhone} added={addedIds.has(details.id)} onToggle={() => toggle(details)} onClose={() => setDetails(null)} />
      )}
    </>
  );
}

function BundleDetails({ bundle: b, isPhone, added, onToggle, onClose }: { bundle: any; isPhone: boolean; added: boolean; onToggle: () => void; onClose: () => void }): JSX.Element {
  const pubs = b.publicationInfo || [];
  const worth = worthOf(b);
  const cols = isPhone ? "1fr auto" : "minmax(0, 2fr) 80px 90px 90px";
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth fullScreen={isPhone}>
      <MDBox p={3} data-testid="bundle-details">
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <MDBox>
            <MDTypography variant="h5" sx={{ color: INK }}>
              {bundleName(b)}
            </MDTypography>
            <MDTypography fontSize="14px" sx={{ color: MUTED }}>
              {pubs.length} publications · worth {creditsText(worth)} if bought separately
            </MDTypography>
          </MDBox>
          <IconButton aria-label="Close bundle details" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </MDBox>
        {b.description && (
          <MDTypography fontSize="14px" sx={{ color: INK, mt: 1.5 }}>
            {blurb(b)}
          </MDTypography>
        )}
        <MDBox mt={2} sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", overflow: "hidden" }}>
          {!isPhone && (
            <MDBox display="grid" gridTemplateColumns={cols} gap={1.5} px={2} py={1} sx={{ background: "#F8F9FA" }}>
              {["Publication", "DA / DR", "Link", "Price"].map((h) => (
                <MDTypography key={h} fontSize="12px" fontWeight="medium" sx={{ color: MUTED, textTransform: "uppercase" }}>
                  {h}
                </MDTypography>
              ))}
            </MDBox>
          )}
          {pubs.map((p: any) => (
            <MDBox key={p.id} display="grid" gridTemplateColumns={cols} gap={1.5} px={2} py={1.25} alignItems="center" sx={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <MDBox display="flex" alignItems="center" gap={1.25} minWidth={0}>
                <Logo p={p} size={32} />
                <MDBox minWidth={0}>
                  <MDTypography fontSize="14px" fontWeight="medium" sx={{ color: INK, wordBreak: "break-word" }}>
                    {p.title}
                  </MDTypography>
                  {p.url && (
                    <Link href={p.url} target="_blank" rel="noopener noreferrer" fontSize="12px" sx={{ color: MUTED }}>
                      {hostOf(p.url)}
                    </Link>
                  )}
                </MDBox>
              </MDBox>
              {!isPhone && (
                <>
                  <MDTypography fontSize="14px" sx={{ color: INK }}>
                    {dash(p?.stats?.da)} / {dash(p?.stats?.dr)}
                  </MDTypography>
                  <MDTypography fontSize="14px" sx={{ color: INK }}>
                    {linkText(p.linkType)}
                  </MDTypography>
                </>
              )}
              <MDTypography fontSize="14px" sx={{ color: MUTED }}>
                {creditsText(p.price)}
              </MDTypography>
            </MDBox>
          ))}
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" gap={2} mt={2} flexWrap="wrap">
          <MDBox>
            <MDTypography fontSize="18px" fontWeight="bold" color="primary">
              {creditsText(b.price)}
            </MDTypography>
            <MDTypography fontSize="12px" sx={{ color: MUTED }}>
              Bundle price, incl. 18% GST
            </MDTypography>
          </MDBox>
          <MDButton color={added ? "success" : "primary"} variant={added ? "outlined" : "contained"} onClick={onToggle} aria-pressed={added}>
            {added ? "Added ✓" : "Add bundle"}
          </MDButton>
        </MDBox>
      </MDBox>
    </Dialog>
  );
}

export default BundlesTab;

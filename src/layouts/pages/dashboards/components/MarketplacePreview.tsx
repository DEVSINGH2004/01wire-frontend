import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import ButtonBase from "@mui/material/ButtonBase";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { IMarketplaceListings, MARKETPLACE_LISTINGS } from "graphql/queries/marketplaceListings";
import { toSites } from "layouts/pages/marketplace/listings";
import { getImageUrl } from "utils/apiConfig";
import { GET_BUNDLES, IGetBundles, IGetBundlesVars } from "graphql/queries/filterBundlesPaginated";
import { BundleCategoryOptions, BundleTypeOptions } from "constants/index";

const PREVIEW_SIZE = 3;
const labelOf = (options: { label: string; value: string }[], value: string) =>
  options.find((o) => o.value === value)?.label || value;

interface PreviewItem {
  id: string;
  image?: string;
  title: string;
  meta: string;
  price?: number;
  priceFrom?: boolean;
}

// Logo, or the item's initials when there is none or it fails to load
const Thumb = ({ src, title }: { src?: string; title: string }) => {
  const [failed, setFailed] = useState(false);
  const url = getImageUrl(src);
  const box = { width: 40, height: 40, borderRadius: "8px", flexShrink: 0 };
  if (url && !failed) {
    return (
      <MDBox
        component="img"
        src={url}
        alt=""
        onError={() => setFailed(true)}
        sx={{ ...box, objectFit: "contain", border: "1px solid rgba(0,0,0,0.08)" }}
      />
    );
  }
  const letters = title
    .split(/[\s.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <MDBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ ...box, backgroundColor: "#ee5c61", color: "#fff", fontWeight: 700, fontSize: "14px" }}
    >
      {letters || "?"}
    </MDBox>
  );
};

// One category column: header, up to PREVIEW_SIZE items, "View all"
const CategoryPreview = ({
  title,
  subtitle,
  Icon,
  items,
  total,
  loading,
  onOpen,
}: {
  title: string;
  subtitle: string;
  Icon: typeof ArticleOutlinedIcon;
  items: PreviewItem[];
  total?: number;
  loading: boolean;
  onOpen: () => void;
}) => (
  <Card sx={{ borderRadius: "12px", height: "100%" }}>
    <MDBox p={2} display="flex" alignItems="center" gap={2}>
      <MDBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="48px"
        height="48px"
        borderRadius="12px"
        flexShrink={0}
        sx={{ backgroundColor: "#ee5c61" }}
      >
        <Icon sx={{ color: "#fff", fontSize: "24px !important" }} />
      </MDBox>
      <MDBox flexGrow={1} minWidth={0}>
        <MDTypography fontSize="18px" fontWeight="bold">
          {title}
          {total !== undefined && (
            <MDTypography component="span" fontSize="14px" fontWeight="regular" color="text">
              {` · ${total} available`}
            </MDTypography>
          )}
        </MDTypography>
        <MDTypography fontSize="14px" fontWeight="light" color="text">
          {subtitle}
        </MDTypography>
      </MDBox>
    </MDBox>
    <Divider sx={{ my: 0 }} />
    <MDBox px={2} py={1} flexGrow={1}>
      {loading ? (
        <MDTypography fontSize="14px" color="text" py={2}>
          Loading…
        </MDTypography>
      ) : items.length ? (
        items.map((item) => (
          <ButtonBase
            key={item.id}
            onClick={onOpen}
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              py: 1,
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            <Thumb src={item.image} title={item.title} />
            <MDBox flexGrow={1} minWidth={0}>
              <MDTypography fontSize="14px" fontWeight="medium" noWrap>
                {item.title}
              </MDTypography>
              <MDTypography fontSize="12px" color="text" noWrap>
                {item.meta}
              </MDTypography>
            </MDBox>
            {item.price !== undefined && item.price !== null && (
              <MDTypography fontSize="14px" fontWeight="bold" color="primary" flexShrink={0}>
                {item.priceFrom ? "from " : ""}
                {item.price} {item.price === 1 ? "credit" : "credits"}
              </MDTypography>
            )}
          </ButtonBase>
        ))
      ) : (
        <MDTypography fontSize="14px" color="text" py={2}>
          Nothing available yet
        </MDTypography>
      )}
    </MDBox>
    <MDBox px={2} pb={2}>
      <MDButton variant="outlined" color="primary" size="small" fullWidth onClick={onOpen}>
        View all {title.toLowerCase()}
        <ArrowForwardIcon sx={{ ml: 0.5 }} />
      </MDButton>
    </MDBox>
  </Card>
);

function MarketplacePreview(): JSX.Element {
  const navigate = useNavigate();
  const { data: pData, loading: pLoading } = useQuery<IMarketplaceListings>(
    MARKETPLACE_LISTINGS,
    { fetchPolicy: "cache-and-network" }
  );
  const { data: bData, loading: bLoading } = useQuery<IGetBundles, IGetBundlesVars>(GET_BUNDLES, {
    variables: { paginationInput: { currentPage: 0, perPage: PREVIEW_SIZE } },
    fetchPolicy: "network-only",
  });

  // Marketplace websites (offerings grouped by domain), highest DA first
  const sites = toSites(pData?.marketplaceListings || []);
  const publications: PreviewItem[] = [...sites]
    .sort((a, b) => (b.da ?? -1) - (a.da ?? -1) || a.name.localeCompare(b.name))
    .slice(0, PREVIEW_SIZE)
    .map((s) => ({
      id: s.id,
      image: s.image,
      title: s.name,
      meta: [
        s.domain,
        s.da !== null && `DA ${s.da}`,
        s.variants.length > 1 && `${s.variants.length} options`,
      ]
        .filter(Boolean)
        .join(" · "),
      price: s.price,
      priceFrom: s.variants.length > 1,
    }));
  const bundles: PreviewItem[] = (bData?.filterBundlesPaginated?.data || []).map((b: any) => ({
    id: b?.id,
    image: b?.image,
    title: `${labelOf(BundleTypeOptions, b?.type)} · ${labelOf(
      BundleCategoryOptions,
      b?.category
    )}`,
    meta: `${b?.publicationIds?.length || 0} publications`,
    price: b?.price,
  }));

  const open = () => navigate("/marketplace");
  const openBundles = () => navigate("/marketplace?tab=bundles");

  return (
    <MDBox mt={3}>
      <MDTypography variant="h6" fontWeight="medium">
        Marketplace
      </MDTypography>
      <Grid mt={0} container spacing={2}>
        <Grid item xs={12} md={6}>
          <CategoryPreview
            title="Publications"
            subtitle="Pick websites to publish on"
            Icon={ArticleOutlinedIcon}
            items={publications}
            total={pData ? sites.length : undefined}
            loading={pLoading && !pData}
            onOpen={open}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CategoryPreview
            title="Bundles"
            subtitle="Ready-made publication bundles"
            Icon={Inventory2OutlinedIcon}
            items={bundles}
            total={bData?.filterBundlesPaginated?.paginationInfo?.itemCount}
            loading={bLoading}
            onOpen={openBundles}
          />
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default MarketplacePreview;

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
import DisplayImage from "components/DisplayImage";
import {
  GET_PUBLICATIONS,
  IGetPublications,
  IGetPublicationsVars,
} from "graphql/queries/filterPublicationsPaginated";
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
}

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
            <DisplayImage
              src={item.image}
              height="40px"
              width="40px"
              alt=""
              styles={{ borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
            />
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
  const { data: pData, loading: pLoading } = useQuery<IGetPublications, IGetPublicationsVars>(
    GET_PUBLICATIONS,
    {
      variables: { filterInput: {}, paginationInput: { currentPage: 0, perPage: PREVIEW_SIZE } },
      fetchPolicy: "network-only",
    }
  );
  const { data: bData, loading: bLoading } = useQuery<IGetBundles, IGetBundlesVars>(GET_BUNDLES, {
    variables: { paginationInput: { currentPage: 0, perPage: PREVIEW_SIZE } },
    fetchPolicy: "network-only",
  });

  const publications: PreviewItem[] = (pData?.filterPublicationsPaginated?.data || []).map(
    (p: any) => ({
      id: p?.id,
      image: p?.image,
      title: p?.title,
      meta: [
        p?.stats?.da !== undefined && p?.stats?.da !== null && `DA ${p.stats.da}`,
        p?.stats?.traffic && `Traffic ${p.stats.traffic}`,
      ]
        .filter(Boolean)
        .join(" · "),
      price: p?.price,
    })
  );
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

  // `section` tells the Marketplace page where to scroll
  const open = (section: "publications" | "bundles") =>
    navigate("/marketplace", { state: { section } });

  return (
    <MDBox mt={3}>
      <MDTypography variant="h6" fontWeight="medium">
        Marketplace
      </MDTypography>
      <Grid mt={0} container spacing={2}>
        <Grid item xs={12} md={6}>
          <CategoryPreview
            title="Single Packages"
            subtitle="Pick individual publications"
            Icon={ArticleOutlinedIcon}
            items={publications}
            total={pData?.filterPublicationsPaginated?.paginationInfo?.itemCount}
            loading={pLoading}
            onOpen={() => open("publications")}
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
            onOpen={() => open("bundles")}
          />
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default MarketplacePreview;

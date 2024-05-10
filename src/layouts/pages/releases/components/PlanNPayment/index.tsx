import { useState, useEffect } from "react";
import { toast } from "react-toastify";
// @mui material components
import Grid from "@mui/material/Grid";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import IconButton from "@mui/material/IconButton";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDCircularLoader from "components/MDCircularLoader";
import DefaultPricingCard from "../DefaultPricingCard";
import ComplexProjectCard from "../ComplexProjectCard";
import { useMaterialUIController } from "context";
import { useMutation, useQuery } from "@apollo/client";
import { GET_BUNDLES, IGetBundles, IGetBundlesVars } from "graphql/queries/filterBundlesPaginated";
import {
  GET_PUBLICATIONS,
  IGetPublications,
  IGetPublicationsVars,
} from "graphql/queries/filterPublicationsPaginated";
import { UPDATE_ARTICLE, IUpdateArticleVars } from "graphql/mutations/updateArticle";

// Custom arrow component for previous button
const PrevArrow = ({ onClick }: { onClick?: any }) => {
  return (
    <IconButton style={{ position: "absolute", top: "50%", left: "-50px", background: "#fff" }}>
      <KeyboardArrowLeftIcon onClick={onClick} />
    </IconButton>
  );
};

// Custom arrow component for next button
const NextArrow = ({ onClick }: { onClick?: any }) => {
  return (
    <IconButton style={{ position: "absolute", top: "50%", right: "-38px", background: "#fff" }}>
      <KeyboardArrowRightIcon onClick={onClick} />
    </IconButton>
  );
};
interface Props {
  cb?: any;
  saveData?: boolean;
  data?: any;
  refetch?: () => void;
  disabled?: any;
  setSaveData?: any;
}
function PlanNPayment({
  data,
  cb,
  saveData,
  refetch,
  disabled = false,
  setSaveData,
}: Props): JSX.Element {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [updateArticle] = useMutation<IUpdateArticleVars>(UPDATE_ARTICLE);
  const [loading, setLoading] = useState<boolean>(false);
  const [publicationIds, setPublicationIds] = useState<any>(
    data?.publicationIds ? data?.publicationIds : []
  );
  const [selected, setSelected] = useState<any>(data?.bundleIds[0]);
  const [bundlePids, setBundlePids] = useState<any>([]);
  const settings = {
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    className: "center",
    infinite: false,
    centerPadding: "60px",
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };
  const { data: bundlesData } = useQuery<IGetBundles, IGetBundlesVars>(GET_BUNDLES, {
    variables: {
      paginationInput: {
        currentPage: 0,
        perPage: 200,
      },
    },
  });
  const { data: publicationsData } = useQuery<IGetPublications, IGetPublicationsVars>(
    GET_PUBLICATIONS,
    {
      variables: {
        filterInput: {
          filterIds: bundlePids,
        },
        paginationInput: {
          currentPage: 0,
          perPage: 200,
        },
      },
    }
  );
  const handleChange = (e: any, pIds: any) => {
    if (e?.target?.value) {
      setSelected(e.target.value);
      setBundlePids(pIds);
    } else {
      setSelected("");
      const newPids = bundlePids?.filter((one: any) => !pIds.includes(one));
      setBundlePids(newPids);
    }
  };
  const handlePublicationClick = (id: any) => {
    if (publicationIds?.indexOf(id) !== -1) {
      const newIds = publicationIds?.filter((one: any) => one !== id);
      setPublicationIds(newIds);
    } else {
      setPublicationIds((oldVal: any) => [...oldVal, id]);
    }
  };
  const onSubmit = () => {
    if (
      JSON.stringify([...publicationIds, ...bundlePids]) !== JSON.stringify(publicationIds) &&
      data?.bundleIds[0] !== selected
    ) {
      setLoading(true);
      updateArticle({
        variables: {
          params: {
            id: data?.id,
            bundleIds: selected ? [selected] : [],
            publicationIds: [...publicationIds, ...bundlePids],
          },
        },
      })
        .then((res: any) => {
          setLoading(false);
          toast.success("Saved Successfully");
          if (refetch) refetch();
          const resId = res?.data?.updateArticle?.id;
          cb(resId);
        })
        .catch((err: any) => {
          setLoading(false);
          toast.error(err?.message);
          console.log("error in saving data", err);
          setSaveData(false);
        });
    } else {
      cb();
    }
  };
  useEffect(() => {
    if (saveData) {
      onSubmit();
    }
  }, [saveData]);
  const groupedData: any = bundlesData?.filterBundlesPaginated?.data?.reduce((acc: any, obj) => {
    const { category, ...rest } = obj;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(rest);
    return acc;
  }, {});
  console.log("groupedData", groupedData);
  return (
    <MDBox>
      {loading && <MDCircularLoader overlayloader startLoader />}
      {groupedData &&
        Object.keys(groupedData)?.map((category: any) => {
          return (
            <MDBox key={category}>
              <MDBox display="flex" alignItems="center">
                <MDTypography variant="h5">Bundles</MDTypography>
                <MDBox
                  sx={{
                    height: "34px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  ml={1}
                  borderRadius="section"
                  px="12px"
                  bgColor="#4579DE"
                >
                  <MDTypography variant="caption" fontWeight="regular" sx={{ color: "#fff" }}>
                    {category}
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDBox bgColor={"grey-200"} borderRadius="lg" p={"24px 60px 24px 70px"} mb={1} mt={2}>
                <Slider {...settings}>
                  {groupedData?.[category]?.map((one: any, i: number) => {
                    return (
                      <MDBox key={i} width={"290px !important"}>
                        <DefaultPricingCard
                          color={darkMode ? "dark" : "white"}
                          badge={{
                            color: one?.type === "PREMIUM" ? "primary" : "rgba(222, 226, 232, 1)",
                            label: one?.type,
                          }}
                          price={{ currency: "$", value: one?.price?.toString(), type: "mo" }}
                          specifications={[
                            { label: "2 team members", includes: true },
                            { label: "20GB Cloud storage", includes: true },
                            { label: "Integration help", includes: false },
                            { label: "Sketch Files", includes: false },
                            { label: "API Access", includes: false },
                            { label: "Complete documentation", includes: false },
                          ]}
                          action={{
                            type: "internal",
                            route: "/",
                            color: darkMode ? "warning" : "dark",
                            label: "join",
                          }}
                          shadow={darkMode}
                          totalPublications={one?.publicationIds?.length}
                          reach={one?.traffic || ""}
                          handleChange={handleChange}
                          selected={selected}
                          id={one?.id}
                          pIds={one?.publicationIds}
                          disabled={disabled}
                        />
                      </MDBox>
                    );
                  })}
                </Slider>
              </MDBox>
            </MDBox>
          );
        })}
      <MDBox py={2} display="flex" justifyContent="space-between">
        <MDTypography variant="h5">Publications</MDTypography>
        {/* <MDBox width="173px" ml="auto">
          <MDInput
            placeholder="Search..."
            size="small"
            fullWidth
            onChange={({ currentTarget }: any) => {
              setSearch(search);
              onSearchChange(currentTarget.value);
            }}
          />
        </MDBox> */}
      </MDBox>
      <MDBox mt={5}>
        <Grid container spacing={3}>
          {publicationsData?.filterPublicationsPaginated?.data?.map((one, i) => {
            return (
              <Grid key={i} item xs={12} md={6} lg={6}>
                <MDBox my={1.5} variant="gradient">
                  <ComplexProjectCard
                    image={one?.image}
                    title={one?.title}
                    description="If everything I did failed - which it doesn't, I think that it actually succeeds."
                    dateTime="02.03.22"
                    stats={[
                      { title: "DA", value: one?.stats?.da },
                      { title: "DR", value: one?.stats?.dr },
                      { title: "PA", value: one?.stats?.pa },
                      { title: "UR", value: one?.stats?.ur },
                    ]}
                    traffic={one?.stats?.traffic}
                    linkType={one?.linkType?.split("_")?.join(" ")}
                    timeLine={one?.timeline?.split("_")?.join(" ")}
                    credits={one?.price}
                    categories={one?.categories?.join(" / ")}
                    onClick={disabled ? () => {} : handlePublicationClick}
                    selected={publicationIds?.length && publicationIds?.indexOf(one?.id) !== -1}
                    id={one?.id}
                  />
                </MDBox>
              </Grid>
            );
          })}
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default PlanNPayment;

import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AppBar, Grid, Toolbar, useScrollTrigger } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import OneWireLogo from "assets/images/OneWireLogo_2.svg";
import {
  GET_ARTICLE_BY_ID,
  IGetArticleById,
  IGetArticleByIdVars,
} from "graphql/queries/getArticleById";
import DisplayImage from "components/DisplayImage";
import Link from "@mui/material/Link";

const ShareReleases = () => {
  const { id } = useParams();
  const { data, loading } = useQuery<IGetArticleById, IGetArticleByIdVars>(GET_ARTICLE_BY_ID, {
    fetchPolicy: "network-only",
    variables: {
      id,
    },
  });
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <MDBox>
      <AppBar
        position="fixed"
        sx={{
          background: trigger ? "rgba(255, 255, 255, 0.8)" : "transparent",
          backdropFilter: trigger ? "blur(8px)" : "none",
          height: "116px",
          boxShadow: "0px 4px 24px 0px rgba(0, 0, 0, 0.06)",
          transition: "background 0.3s ease-out, backdrop-filter 0.3s ease-out",
        }}
      >
        <Toolbar sx={{ height: "100%" }}>
          <MDBox m="auto">
            <img src={OneWireLogo} height={"46px"} width="100%" />
          </MDBox>
        </Toolbar>
      </AppBar>
      <MDBox sx={{ minHeight: "400px", marginTop: "116px" }}>
        {loading ? (
          <MDCircularLoader startLoader />
        ) : id ? (
          <MDBox sx={{ padding: "40px 180px" }}>
            <MDTypography fontSize="50px" color="black" fontWeight="bold">
              {data?.getArticleById?.title}
            </MDTypography>
            <MDBox sx={{ marginTop: "30px" }}>
              <DisplayImage
                src={data?.getArticleById?.featureImage}
                height="550px"
                width="100%"
                alt={"img"}
                styles={{ borderRadius: "10px" }}
              />
            </MDBox>
            <MDTypography sx={{ marginTop: "40px" }} fontSize="20px">
              {data?.getArticleById?.summary}
            </MDTypography>
            <MDTypography
              fontSize="35px"
              color="black"
              fontWeight="bold"
              sx={{ marginTop: "20px" }}
            >
              Introduction
            </MDTypography>

            <MDTypography sx={{ marginTop: "20px" }} fontSize="20px">
              {data?.getArticleById?.content.replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, "")}
            </MDTypography>

            <MDBox
              sx={{
                minHeight: "300px",
                marginTop: "50px",
                width: "100%",
                boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
                borderRadius: "10px",
                textAlign: "center",
                padding: "20px 0px",
              }}
              bgColor="white"
            >
              <MDTypography
                fontSize="20px"
                color="black"
                fontWeight="bold"
                sx={{ paddingBottom: "10px" }}
              >
                Media Contact
              </MDTypography>
              <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                Name : {data?.getArticleById?.mediaContact?.name}
              </MDTypography>
              <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                Email : {data?.getArticleById?.mediaContact?.email}
              </MDTypography>
              <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                Phone : {data?.getArticleById?.mediaContact?.phone}
              </MDTypography>
              <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                Website : {data?.getArticleById?.mediaContact?.website}
              </MDTypography>
              <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                Address : {data?.getArticleById?.mediaContact?.address}
              </MDTypography>

              <MDTypography
                fontSize="20px"
                color="black"
                fontWeight="bold"
                sx={{ padding: "30px 0px 10px 0px" }}
              >
                Social Media
              </MDTypography>

              <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                Facebook :{" "}
                <Link
                  sx={{
                    cursor: "pointer",
                  }}
                  href={data?.getArticleById?.mediaContact?.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.getArticleById?.mediaContact?.facebook}
                </Link>
              </MDTypography>
              <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                Instagram :{" "}
                <Link
                  sx={{
                    cursor: "pointer",
                  }}
                  href={data?.getArticleById?.mediaContact?.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.getArticleById?.mediaContact?.instagram}
                </Link>
              </MDTypography>
            </MDBox>
          </MDBox>
        ) : (
          <MDBox
            sx={{
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MDTypography variant="h6">No estimation found</MDTypography>
          </MDBox>
        )}
      </MDBox>
    </MDBox>
  );
};

export default ShareReleases;

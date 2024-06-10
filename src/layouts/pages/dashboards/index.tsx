import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { IGetArticleStats, GET_ARTICLE_STATS } from "graphql/queries/getArticleStats";
import {
  GET_ARTICLES,
  IGetArticles,
  IGetArticlesVars,
} from "graphql/queries/filterArticlesPaginated";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import DisplayImage from "components/DisplayImage";
// Material Dashboard 2 PRO React TS examples components
import Footer from "examples/Footer";
// Images
import ERIcon from "assets/images/ER.svg";
import AAIcon from "assets/images/AA.svg";
import ScheduledIcon from "assets/images/Scheduled.svg";
import RejectedIcon from "assets/images/Rejected.svg";
import TiltArrowIcon from "assets/images/TiltArrow.svg";

function Overview(): JSX.Element {
  const navigate = useNavigate();
  const { data: articlesData, loading: aLoading } = useQuery<IGetArticles, IGetArticlesVars>(
    GET_ARTICLES,
    {
      variables: {
        filterInput: {},
        paginationInput: {
          currentPage: 0,
          perPage: 3,
        },
      },
      fetchPolicy: "network-only",
    }
  );
  const { data: hArticlesData, loading: hLoading } = useQuery<IGetArticles, IGetArticlesVars>(
    GET_ARTICLES,
    {
      variables: {
        filterInput: {
          status: "PUBLISHED",
        },
        paginationInput: {
          currentPage: 0,
          perPage: 3,
        },
      },
      fetchPolicy: "network-only",
    }
  );
  const { data, loading } = useQuery<IGetArticleStats>(GET_ARTICLE_STATS, {
    fetchPolicy: "network-only",
  });
  const editorialReview = data?.getArticleStats?.find((one: any) => one?.status === "IN_REVIEW");
  const awaitingApproval = data?.getArticleStats?.find(
    (one: any) => one?.status === "AWAITING_APPROVAL"
  );
  const scheduled = data?.getArticleStats?.find((one: any) => one?.status === "SCHEDULED");
  const rejected = data?.getArticleStats?.find((one: any) => one?.status === "REJECTED");
  return (
    <>
      {aLoading || loading || hLoading ? (
        <MDCircularLoader startLoader />
      ) : (
        <>
          <MDTypography mt={1} variant="h6" fontWeight="medium">
            Current Status
          </MDTypography>
          <Grid mt={1} container spacing={2}>
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 2, borderRadius: "12px", height: "124px" }}>
                <MDBox display="flex" alignItems="center" justifyContent="space-between">
                  <img src={ERIcon} height="64px" width="64px" alt="ER" />
                  <MDBox>
                    <MDTypography fontSize="16px" fontWeight="light" color="text">
                      Editorial Review
                    </MDTypography>
                    <MDTypography fontSize="32px" fontWeight="bold" textAlign="right">
                      {editorialReview || 0}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 2, borderRadius: "12px", height: "124px" }}>
                <MDBox display="flex" alignItems="center" justifyContent="space-between">
                  <img src={AAIcon} height="64px" width="64px" alt="ER" />
                  <MDBox>
                    <MDTypography fontSize="16px" fontWeight="light" color="text">
                      Awaiting Approval
                    </MDTypography>
                    <MDTypography fontSize="32px" fontWeight="bold" textAlign="right">
                      {awaitingApproval || 0}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 2, borderRadius: "12px", height: "124px" }}>
                <MDBox display="flex" alignItems="center" justifyContent="space-between">
                  <img src={ScheduledIcon} height="64px" width="64px" alt="ER" />
                  <MDBox>
                    <MDTypography fontSize="16px" fontWeight="light" color="text">
                      Scheduled
                    </MDTypography>
                    <MDTypography fontSize="32px" fontWeight="bold" textAlign="right">
                      {scheduled || 0}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 2, borderRadius: "12px", height: "124px" }}>
                <MDBox display="flex" alignItems="center" justifyContent="space-between">
                  <img src={RejectedIcon} height="64px" width="64px" alt="ER" />
                  <MDBox>
                    <MDTypography fontSize="16px" fontWeight="light" color="text">
                      Rejected
                    </MDTypography>
                    <MDTypography fontSize="32px" fontWeight="bold" textAlign="right">
                      {rejected || 0}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
          {/* <MDTypography mt={3} variant="h6" fontWeight="medium">
            Recent Press Release
          </MDTypography> */}
          {/* <Grid mt={1} container spacing={2}>
            {articlesData?.filterArticlesPaginated?.data?.length > 0 ? (
              articlesData?.filterArticlesPaginated?.data?.map((one: any, i: any) => {
                return (
                  <Grid item xs={12} md={4} key={one + i}>
                    <Card
                      sx={{
                        p: 1,
                        display: "flex",
                        flexDirection: "row",
                        height: "137px",
                        alignItems: "center",
                      }}
                    >
                      <DisplayImage
                        src={one?.featureImage}
                        height="121px"
                        width="160px"
                        alt="PR Image"
                        styles={{ borderRadius: "8.99px" }}
                      />
                      <CardContent sx={{ ml: 1, mt: 2, p: 0 }}>
                        <MDTypography fontSize="16px" fontWeight="regular" width="150px">
                          {one?.title}
                        </MDTypography>
                        <MDTypography
                          variant="body2"
                          sx={{ mt: 1, color: "rgba(123, 128, 154, 1)" }}
                        >
                          {dayjs(one?.createdAt).format("DD MMM YYYY, h:mm A")}
                        </MDTypography>
                        <IconButton
                          size="small"
                          color="inherit"
                          sx={{ mt: 1 }}
                          onClick={() => {
                            navigate(`/releases/${one?.id}`);
                          }}
                        >
                          <img
                            src={TiltArrowIcon}
                            height="36px"
                            width="36px"
                            alt="Tilt Arrow Icon"
                          />
                        </IconButton>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <MDBox m="auto">
                <MDTypography variant="h6">No Recent Press Release Found</MDTypography>
              </MDBox>
            )}
          </Grid> */}
          <MDBox mt={3} display="flex" alignItems="center" justifyContent="space-between">
            <MDTypography variant="h6" fontWeight="medium">
              History
            </MDTypography>
          </MDBox>
          <Grid mt={1} container spacing={2}>
            {hArticlesData?.filterArticlesPaginated?.data?.length > 0 ? (
              hArticlesData?.filterArticlesPaginated?.data?.map((one: any, i: any) => {
                return (
                  <Grid item xs={12} md={4} key={one + i}>
                    <Card
                      sx={{
                        p: 1,
                        height: "307px",
                      }}
                    >
                      <DisplayImage
                        src={one?.featureImage}
                        height="212px"
                        width="100%"
                        alt="History PR Image"
                        styles={{ borderRadius: "8.99px" }}
                      />
                      <CardContent
                        sx={{
                          m: 1,
                          p: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <MDBox>
                          <MDTypography fontSize="16px" fontWeight="regular" width="250px">
                            {one?.title}
                          </MDTypography>
                          <MDTypography
                            variant="body2"
                            sx={{ mt: 1, color: "rgba(123, 128, 154, 1)" }}
                          >
                            {dayjs(one?.createdAt).format("DD MMM YYYY, h:mm A")}
                          </MDTypography>
                        </MDBox>
                        <IconButton
                          size="small"
                          color="inherit"
                          sx={{ mt: 1 }}
                          onClick={() => {
                            navigate(`/releases/${one?.id}`);
                          }}
                        >
                          <img
                            src={TiltArrowIcon}
                            height="36px"
                            width="36px"
                            alt="Tilt Arrow Icon"
                          />
                        </IconButton>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <MDBox m="auto">
                <MDTypography variant="h6">No History Found</MDTypography>
              </MDBox>
            )}
          </Grid>
          <MDBox mt="100px">
            <Footer />
          </MDBox>
        </>
      )}
    </>
  );
}

export default Overview;

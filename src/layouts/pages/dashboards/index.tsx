import dayjs from "dayjs";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import ERIcon from "assets/images/ER.svg";
import AAIcon from "assets/images/AA.svg";
import ScheduledIcon from "assets/images/Scheduled.svg";
import RejectedIcon from "assets/images/Rejected.svg";
import TiltArrowIcon from "assets/images/TiltArrow.svg";

function Overview(): JSX.Element {
  return (
    <DashboardLayout>
      <DashboardNavbar />
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
                  1
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
                  0
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
                  9
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
                  12
                </MDTypography>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
      <MDTypography mt={3} variant="h6" fontWeight="medium">
        Recent Press Release
      </MDTypography>
      <Grid mt={1} container spacing={2}>
        {Array.from({ length: 3 })?.map((one: any, i: any) => {
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
                <CardMedia
                  component="img"
                  image={homeDecor1}
                  alt="Paella dish"
                  sx={{
                    height: "121px",
                    width: "160px",
                    borderRadius: "8.99px",
                    margin: 0,
                  }}
                />
                <CardContent sx={{ m: 1, p: 0 }}>
                  <MDTypography
                    fontSize="16px"
                    fontWeight="regular"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "150px",
                    }}
                  >
                    EU Drafts New Rules for all the new press releases.All Press releases should be
                    according to the new draft rules.
                  </MDTypography>
                  <MDTypography variant="body2" sx={{ mt: 1, color: "rgba(123, 128, 154, 1)" }}>
                    {dayjs("2024-02-16T14:33:00").format("DD MMM YYYY, h:mm A")}
                  </MDTypography>
                  <IconButton size="small" color="inherit" sx={{ mt: 1 }} onClick={() => {}}>
                    <img src={TiltArrowIcon} height="36px" width="36px" alt="Tilt Arrow Icon" />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <MDBox mt={3} display="flex" alignItems="center" justifyContent="space-between">
        <MDTypography variant="h6" fontWeight="medium">
          History
        </MDTypography>
      </MDBox>
      <Grid mt={1} container spacing={2}>
        {Array.from({ length: 3 })?.map((one: any, i: any) => {
          return (
            <Grid item xs={12} md={4} key={one + i}>
              <Card
                sx={{
                  p: 1,
                  height: "307px",
                }}
              >
                <CardMedia
                  component="img"
                  image={homeDecor3}
                  alt="Paella dish"
                  sx={{
                    height: "212px",
                    borderRadius: "8.99px",
                    margin: 0,
                  }}
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
                    <MDTypography
                      fontSize="16px"
                      fontWeight="regular"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "250px",
                      }}
                    >
                      EU Drafts New Rules for all the new press releases.All Press releases should
                      be according to the new draft rules.
                    </MDTypography>
                    <MDTypography variant="body2" sx={{ mt: 1, color: "rgba(123, 128, 154, 1)" }}>
                      {dayjs("2024-02-16T14:33:00").format("DD MMM YYYY, h:mm A")}
                    </MDTypography>
                  </MDBox>
                  <IconButton size="small" color="inherit" sx={{ mt: 1 }} onClick={() => {}}>
                    <img src={TiltArrowIcon} height="36px" width="36px" alt="Tilt Arrow Icon" />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <MDBox mt={"100px"}>
        <Footer />
      </MDBox>
    </DashboardLayout>
  );
}

export default Overview;

import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import BillingInformation from "./components/BillingInformation";
import TopUpPackages from "./components/TopUpPackages";

function MyCredits(): JSX.Element {
  return (
    <DashboardLayout>
      <MDBox mt={4}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <BillingInformation />
            </Grid>
            <Grid item xs={12} md={7}>
              <TopUpPackages />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default MyCredits;

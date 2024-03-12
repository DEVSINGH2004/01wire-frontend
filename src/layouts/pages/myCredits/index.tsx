// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React TS components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import BillingInformation from "./components/BillingInformation";
import Transactions from "./components/Transactions";

function MyCredits(): JSX.Element {
  return (
    <DashboardLayout>
      <MDBox mt={4}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid>
            <Grid item xs={12} md={5}>
              <Transactions />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default MyCredits;

import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import BillingInformation from "./components/BillingInformation";
import TopUpPackages from "./components/TopUpPackages";
import { useQuery } from "@apollo/client";
import { IGetUserWallet, GET_USER_WALLET } from "graphql/queries/getUserWallet";

function MyCredits(): JSX.Element {
  const { data, loading, refetch } = useQuery<IGetUserWallet>(GET_USER_WALLET, {
    fetchPolicy: "network-only",
  });

  return (
    <MDBox mt={4}>
      <MDBox mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <BillingInformation data={data} />
          </Grid>
          <Grid item xs={12} md={7}>
            <TopUpPackages />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default MyCredits;

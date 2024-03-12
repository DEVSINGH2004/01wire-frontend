

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";


// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import colors from "assets/theme/base/colors";


// Billing page components
import Bill from "../Bill";
import Transaction from "../Transaction";


function BillingInformation(): JSX.Element {
  const { pinkCard } = colors;
  return (
    <Card id="delete-account">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Wallet
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          
          
          <MDBox
            display="flex"
            flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor={ "grey-100"}
      borderRadius="lg"
      p={3}
      mb={ 1}
      mt={2}
    >
                          <MDBox
                  variant="gradient"
              bgColor={pinkCard.main}
                  color="white"
                  width="4rem"
                  height="4rem"
                  borderRadius="md"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  shadow="md"
                >
                  <Icon fontSize="medium" color="inherit">
                    account_balance_wallet_outlined
                  </Icon>
                </MDBox>
                </MDBox>
                <MDBox
            display="flex"
            flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor={ "grey-100"}
      borderRadius="lg"
      p={3}
      mb={ 1}
      mt={2}
    >
     
        <MDBox mt={1} mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            Past Recharges
          </MDTypography>
        </MDBox>
        <MDBox
          component="ul"
              display="flex"
              width="100%"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          <Transaction
            color="success"
            icon="add"
            name="Credit Recharge"
            description="26 March 2020, at 13:45 PM"
            value="750"
          />
          <Transaction
            color="success"
            icon="add"
            name="Credit Recharge"
            description="26 March 2020, at 12:30 PM"
            value="1,000"
          />
          <Transaction
            color="success"
            icon="add"
            name="Credit Recharge"
            description="26 March 2020, at 08:30 AM"
            value="2,500"
          />
          <Transaction
            color="success"
            icon="add"
            name="Credit Recharge"
            description="26 March 2020, at 05:00 AM"
            value="750"
          />
        </MDBox>
      </MDBox>
        </MDBox>
        </MDBox>
    </Card>
  );
}

export default BillingInformation;

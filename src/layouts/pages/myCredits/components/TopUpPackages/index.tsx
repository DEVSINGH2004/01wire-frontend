import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import WalletIcon from "assets/images/account_balance_wallet.svg";
import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION, ICreateTransactionVars } from "graphql/mutations/createTransaction";
import PackageBg from "assets/images/packageBg.svg";

const cardStyles = {
  p: 2,
  background: `url(${PackageBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  height: "94px",
};

const TopUpPackages = () => {
  const [createTransaction] = useMutation<ICreateTransactionVars>(CREATE_TRANSACTION);
  return (
    <Card sx={{ height: "100%", p: 2 }}>
      <MDTypography fontSize="14px" fontWeight="medium" color="textSecondary">
        Recommended Top-up
      </MDTypography>
      <Grid container mt={1} spacing={2}>
        <Grid item xs={12} md={6}>
          <MDBox>
            <Card
              sx={{
                ...cardStyles,
              }}
            >
              <MDBox
                position="absolute"
                left={15}
                bottom={2}
                display="flex"
                alignItems="center"
                alignSelf="center"
              >
                <img src={WalletIcon} height={"35px"} width={"35px"} />
                <MDTypography fontSize="29px" fontWeight="medium" color="white">
                  10 Credits
                </MDTypography>
              </MDBox>
            </Card>
            <MDBox
              sx={{ background: "rgba(245, 245, 250, 1)", borderRadius: "0 0 12px 12px" }}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              pt={4}
              px={2}
              pb={2}
              mt={-3}
            >
              <MDTypography color="primary" fontSize="24px">
                $10
              </MDTypography>
              <MDButton color="primary" size="small">
                <MDTypography fontSize="16px" fontWeight="regular" color="white">
                  Buy $10
                </MDTypography>
              </MDButton>
            </MDBox>
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <MDBox>
            <Card
              sx={{
                ...cardStyles,
              }}
            >
              <MDBox
                position="absolute"
                left={15}
                bottom={2}
                display="flex"
                alignItems="center"
                alignSelf="center"
              >
                <img src={WalletIcon} height={"35px"} width={"35px"} />
                <MDTypography fontSize="29px" fontWeight="medium" color="white">
                  10 Credits
                </MDTypography>
              </MDBox>
            </Card>
            <MDBox
              sx={{ background: "rgba(245, 245, 250, 1)", borderRadius: "0 0 12px 12px" }}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              pt={4}
              px={2}
              pb={2}
              mt={-3}
            >
              <MDTypography color="primary" fontSize="24px">
                $10
              </MDTypography>
              <MDButton color="primary" size="small">
                <MDTypography fontSize="16px" fontWeight="regular" color="white">
                  Buy $10
                </MDTypography>
              </MDButton>
            </MDBox>
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <MDBox>
            <Card
              sx={{
                ...cardStyles,
              }}
            >
              <MDBox
                position="absolute"
                left={15}
                bottom={2}
                display="flex"
                alignItems="center"
                alignSelf="center"
              >
                <img src={WalletIcon} height={"35px"} width={"35px"} />
                <MDTypography fontSize="29px" fontWeight="medium" color="white">
                  10 Credits
                </MDTypography>
              </MDBox>
            </Card>
            <MDBox
              sx={{ background: "rgba(245, 245, 250, 1)", borderRadius: "0 0 12px 12px" }}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              pt={4}
              px={2}
              pb={2}
              mt={-3}
            >
              <MDTypography color="primary" fontSize="24px">
                $10
              </MDTypography>
              <MDButton color="primary" size="small">
                <MDTypography fontSize="16px" fontWeight="regular" color="white">
                  Buy $10
                </MDTypography>
              </MDButton>
            </MDBox>
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <MDBox>
            <Card
              sx={{
                ...cardStyles,
              }}
            >
              <MDBox
                position="absolute"
                left={15}
                bottom={2}
                display="flex"
                alignItems="center"
                alignSelf="center"
              >
                <img src={WalletIcon} height={"35px"} width={"35px"} />
                <MDTypography fontSize="29px" fontWeight="medium" color="white">
                  10 Credits
                </MDTypography>
              </MDBox>
            </Card>
            <MDBox
              sx={{ background: "rgba(245, 245, 250, 1)", borderRadius: "0 0 12px 12px" }}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              pt={4}
              px={2}
              pb={2}
              mt={-3}
            >
              <MDTypography color="primary" fontSize="24px">
                $10
              </MDTypography>
              <MDButton color="primary" size="small">
                <MDTypography fontSize="16px" fontWeight="regular" color="white">
                  Buy $10
                </MDTypography>
              </MDButton>
            </MDBox>
          </MDBox>
        </Grid>
      </Grid>
    </Card>
  );
};

export default TopUpPackages;

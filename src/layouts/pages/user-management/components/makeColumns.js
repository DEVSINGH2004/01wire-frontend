/* eslint-disable react/prop-types */
import { IconButton } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import NavigateIcon from "assets/images/icons/navigateIcon.svg";


export const makeColumns = (

) => {
  
   const columns = [
    {
      Header: "User Email",
      accessor: "email",
      width: "20%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {value}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "User Name",
      accessor: "fullName",
      width: "20%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {value}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Wallet Balance",
      accessor: "walletInfo.balance",
      width: "20%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {value}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Total PR",
      accessor: "totalPR",
      width: "20%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            10
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Action",
      Align: "right",
      width: "20%",
      Cell: ({ value }) => {
        return (
          <MDBox
            sx={{
              display: "flex",
            }}
          >
              <IconButton>
                <img width={36} height={36} alt="navigate" src={NavigateIcon} />
              </IconButton>
          </MDBox>
        );
      },
    },
  ];

  return columns;
};

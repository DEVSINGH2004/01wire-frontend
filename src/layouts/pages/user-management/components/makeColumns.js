/* eslint-disable react/prop-types */
import { IconButton } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import NavigateIcon from "assets/images/icons/navigateIcon.svg";

export const makeColumns = (navigate) => {
  const columns = [
    {
      Header: "User Email",
      accessor: "email",
      width: "20%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>{value}</MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "User Name",
      accessor: "fullName",
      width: "20%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>{value}</MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Wallet Balance",
      accessor: "walletInfo.balance",
      width: "20%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>{value}</MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Total PR",
      accessor: "totalPR",
      width: "20%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>10</MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Action",
      Align: "right",
      width: "20%",
      Cell: ({ value, row }) => {
        return (
          <MDBox
            sx={{
              display: "flex",
            }}
          >
            <IconButton
              onClick={() =>
                navigate(`/pr-management?userID=${row.original.id}&email=${row.original.email}`)
              }
            >
              <img width={36} height={36} alt="navigate" src={NavigateIcon} />
            </IconButton>
          </MDBox>
        );
      },
    },
  ];

  return columns;
};

import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import DataTable from "examples/Tables/DataTable";
import { useQuery } from "@apollo/client";
import { IGetUsers, IGetUsersVars, GET_USERS } from "graphql/queries/filterUsersPaginated";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const columns = [
  {
    // Header: "User Email",
    accessor: "userEmail",
    width: "25%",
    Cell: ({ value }: { value: string }) => <MDTypography>{value}</MDTypography>,
  },
  {
    Header: "User Name",
    accessor: "userName",
    width: "25%",
    Cell: ({ value }: { value: string }) => <MDTypography>{value}</MDTypography>,
  },
  {
    Header: "Wallet Balance",
    accessor: "walletBalance",
    width: "25%",
    Cell: ({ value }: { value: string }) => <MDTypography>{value}</MDTypography>,
  },
  {
    Header: "Total PR",
    accessor: "totalPR",
    width: "25%",
    Cell: ({ value }: { value: string }) => <MDTypography>{value}</MDTypography>,
  },
];

const UserManagement = () => {
  const { data, loading } = useQuery<IGetUsers, IGetUsersVars>(GET_USERS, {
    variables: {
      filterInput: {},
      paginationInput: {
        currentPage: 0,
        perPage: 200,
      },
    },
    fetchPolicy: "network-only",
  });
  console.log("data", data);
  const [tableData, setData] = useState<any>({ rows: [], columns });
  const [loader, setLoader] = useState<boolean>(false);
  useEffect(() => {
    setLoader(true);
    const articles = data?.filterUsersPaginated?.data;
    let rows: any = [];
    if (articles?.length) {
      rows = articles?.map((one) => {
        return {
          userEmail: one?.email,
          userName: one?.fullName,
          walletBalance: one?.walletInfo?.balance,
          totalPR: "10",
        };
      });
    }
    setData({ rows, columns });
    setLoader(false);
  }, [data]);
  return (
    <>
    <DashboardNavbar />
    <MDBox px={2}>
      <MDBox pt={2}>
        <MDTypography fontWeight="bold" fontSize="20px">
          User Management
        </MDTypography>
      </MDBox>
      <MDBox pt={2} pb={3}>
        <Card sx={{ minHeight: "300px" }}>
          {loading || loader ? (
            <MDCircularLoader overlayloader startLoader />
          ) : tableData?.rows?.length ? (
            <DataTable table={tableData} />
          ) : (
            <MDBox m={"auto"}>
              <MDTypography variant="h6">No data found</MDTypography>
            </MDBox>
          )}
        </Card>
      </MDBox>
    </MDBox>
    </>
  );
};
export default UserManagement;

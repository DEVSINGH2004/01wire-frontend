import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import DataTable from "./components/DataTable";
import { useQuery } from "@apollo/client";
import {
  GET_ARTICLES,
  IGetArticles,
  IGetArticlesVars,
} from "graphql/queries/filterArticlesPaginated";
import PRDetail from "./components/PRDetail";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { makeColumns } from "./components/makeColumns";

const PRManagement = () => {
  const { id } = useParams();
  const { data, loading, refetch } = useQuery<IGetArticles, IGetArticlesVars>(GET_ARTICLES, {
    variables: {
      filterInput: {},
      paginationInput: {
        currentPage: 0,
        perPage: 200,
      },
    },
    fetchPolicy: "network-only",
  });
  const [loader, setLoader] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<any>(id || false);
  const [tableData, setData] = useState<any>({ rows: [], columns: [] });

  const onSelect = () => {};

  useEffect(() => {
    setLoader(true);
    const articles = data?.filterArticlesPaginated?.data;
    const rows: any = articles || [];
    const columns = makeColumns(onSelect);

    setData({ rows, columns });
    setLoader(false);
  }, [data]);

  return (
    <>
      <DashboardNavbar />
      <MDBox px={2}>
        {!openForm && (
          <MDBox pt={2} display="flex" alignItems="center" justifyContent="space-between">
            <MDTypography fontWeight="bold" fontSize="20px">
              PR Management
            </MDTypography>
          </MDBox>
        )}
        <MDBox pt={openForm ? 3 : 2} pb={3}>
          {loading || loader ? (
            <Card sx={{ minHeight: "300px" }}>
              <MDCircularLoader overlayloader startLoader />
            </Card>
          ) : openForm ? (
            <Card sx={{ minHeight: "300px" }}>
              <PRDetail onClose={() => setOpenForm(false)} refetch={refetch} id={openForm} />
            </Card>
          ) : tableData?.rows?.length ? (
            <DataTable canSearch table={tableData} showHeader />
          ) : (
            <Card sx={{ minHeight: "300px" }}>
              <MDBox m={"auto"}>
                <MDTypography variant="h6">No data found</MDTypography>
              </MDBox>
            </Card>
          )}
        </MDBox>
      </MDBox>
    </>
  );
};
export default PRManagement;

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import { useLazyQuery } from "@apollo/client";
import { GET_BUNDLES, IGetBundles, IGetBundlesVars } from "graphql/queries/filterBundlesPaginated";
import BundleForm from "./components/BundleForm";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { makeColumns } from "./components/makeColumns";
import DataTable from "../pr-management/components/DataTable";

const PER_PAGE = 10;

const Bundles = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [tableData, setData] = useState<any>({ rows: [], columns: [] });
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<any>(id || false);

  const [getBundles, { data, loading, refetch }] = useLazyQuery<IGetBundles, IGetBundlesVars>(
    GET_BUNDLES,
    {
      fetchPolicy: "network-only",
      onCompleted: (res) => {
        setPaginationInfo(res.filterBundlesPaginated.paginationInfo);
      },
    }
  );

  useEffect(() => {
    setLoader(true);
    getBundles({
      variables: {
        paginationInput: {
          currentPage: 0,
          perPage: PER_PAGE,
        },
      },
    });
    setLoader(false);
  }, []);

  useEffect(() => {
    setLoader(true);
    const rows = data?.filterBundlesPaginated?.data || [];
    const columns = makeColumns();

    setData({ rows, columns });
    setLoader(false);
  }, [data]);

  const handlePagination = (page: number) => {
    getBundles({
      variables: {
        paginationInput: {
          perPage: PER_PAGE,
          currentPage: page,
        },
      },
    });
  };

  return (
    <>
      <DashboardNavbar text="Add Bundle" onsubmit={!openForm && (() => setOpenForm(true))} />
      <MDBox px={2}>
        {!openForm && (
          <MDBox pt={2} display="flex" alignItems="center" justifyContent="space-between">
            <MDTypography fontWeight="bold" fontSize="20px">
              Bundles
            </MDTypography>
          </MDBox>
        )}
        <MDBox pt={openForm ? 3 : 2} pb={3}>
          {loading || loader ? (
            <Card sx={{ minHeight: "300px" }}>
              <MDCircularLoader overlayloader startLoader />
            </Card>
          ) : openForm ? (
            <BundleForm
              onClose={() => {
                navigate("/bundles");
                setOpenForm(false);
              }}
              refetch={refetch}
              id={openForm}
            />
          ) : data?.filterBundlesPaginated?.data?.length ? (
            <DataTable
              loading={loading}
              handlePagination={handlePagination}
              table={tableData}
              showHeader
              paginationInfo={paginationInfo || {}}
            />
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
export default Bundles;

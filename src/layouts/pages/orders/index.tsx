import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import { useLazyQuery } from "@apollo/client";
import { GET_ORDERS, IGetOrders, IGetOrdersVars } from "graphql/queries/filterOrdersPaginated";
import OrderDetail from "./components/orderDetail";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "../pr-management/components/DataTable";
import Filters from "./components/Filters";
import { makeColumns } from "./components/makeColumns";
import ArticleBundleModal from "../releases/components/ArticleBundleModal";

const PER_PAGE = 10;

const OrderManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tableData, setData] = useState<any>({ rows: [], columns: [] });
  const [loader, setLoader] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<any>(id || false);
  const [initLoading, setInitLoader] = useState<boolean>(false);
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const [filters, setFilters] = useState<any>({});
  const [email, setEmail] = useState<string>("");
  const [options, setOptions] = useState<any>([]);
  const [noteModal, setNoteModal] = useState<any>(null);
  const [viewModal, setViewModal] = useState<any>(null);

  const [getOrders, { data, loading, refetch }] = useLazyQuery<IGetOrders, IGetOrdersVars>(
    GET_ORDERS,
    {
      onCompleted: (res) => {
        setPaginationInfo(res?.filterOrdersPaginated?.paginationInfo);
      },
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    setInitLoader(true);
    getOrders({
      variables: {
        paginationInput: {
          perPage: PER_PAGE,
          currentPage: 0,
        },
        filterInput: {},
      },
    })
      .then(() => setInitLoader(false))
      .catch(() => setInitLoader(false));
  }, []);

  useEffect(() => {
    if (filters) {
      getOrders({
        variables: {
          paginationInput: {
            perPage: PER_PAGE,
            currentPage: 0,
          },
          filterInput: {
            ...filters,
          },
        },
      });
    }
  }, [filters]);

  useEffect(() => {
    const rows = data?.filterOrdersPaginated?.data || [];
    const columns = makeColumns(handleAction, handleFilters, setEmail, setOptions, filters);

    setData({ rows, columns });
  }, [data]);

  const handleFilters = (key: string, val: any) => {
    let updatedFilters = { ...filters };
    if (val) {
      updatedFilters = {
        ...updatedFilters,
        [key]: val,
      };
    } else {
      delete updatedFilters?.[key];
    }
    setFilters(updatedFilters);
  };

  const handleAction = (id: string, action: string) => {
    if (action === "edit") {
      setOpenForm(id);
    } else if (action === "view") {
      setViewModal(id);
    }
  };

  const handlePagination = (page: number) => {
    getOrders({
      variables: {
        paginationInput: {
          perPage: PER_PAGE,
          currentPage: page,
        },
        filterInput: {
          ...filters,
        },
      },
    });
  };

  return (
    <>
      <DashboardNavbar />
      <MDBox px={2}>
        {!openForm && (
          <>
            <Filters
              setFilters={setFilters}
              email={email}
              setEmail={setEmail}
              handleFilters={handleFilters}
              filters={filters}
              options={options}
              setOptions={setOptions}
            />
          </>
        )}
        <MDBox pt={openForm ? 3 : 2} pb={3}>
          {initLoading ? (
            <Card sx={{ minHeight: "300px" }}>
              <MDCircularLoader overlayloader startLoader />
            </Card>
          ) : openForm ? (
            <Card sx={{ minHeight: "300px" }}>
              <OrderDetail onClose={() => setOpenForm(false)} refetch={refetch} id={openForm} />
            </Card>
          ) : loading || !!data?.filterOrdersPaginated?.data?.length ? (
            <DataTable
              handlePagination={handlePagination}
              table={tableData}
              showHeader
              loading={loading}
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
      {viewModal && <ArticleBundleModal onClose={() => setViewModal(null)} articleId={viewModal} />}
    </>
  );
};
export default OrderManagement;

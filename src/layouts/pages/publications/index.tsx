import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import MDCircularLoader from "components/MDCircularLoader";
import { useLazyQuery } from "@apollo/client";
import {
  GET_PUBLICATIONS,
  IGetPublications,
  IGetPublicationsVars,
} from "graphql/queries/filterPublicationsPaginated";
import EditIcon from "assets/images/icons/penCircle.svg";
import { ActionsCellRenderer } from "utils/helpers";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import PublicationForm from "./components/PublicationForm";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { makeColumns } from "./components/makeColumns";
import DataTable from "../pr-management/components/DataTable";
import Filters from "./components/Filters";

const PER_PAGE = 10;
const Publications = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [paginationInfo, setPaginationInfo] = useState<any>({});

  const [tableData, setData] = useState<any>({ rows: [], columns: [] });
  const [loader, setLoader] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<any>(id || false);
  const [filters, setFilters] = useState<any>({});

  const [getPulications, { data, loading, refetch }] = useLazyQuery<
    IGetPublications,
    IGetPublicationsVars
  >(GET_PUBLICATIONS, {
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setPaginationInfo(res.filterPublicationsPaginated.paginationInfo);
    },
  });

  useEffect(() => {
    setLoader(true);
    getPulications({
      variables: {
        filterInput: {},
        paginationInput: {
          currentPage: 0,
          perPage: PER_PAGE,
        },
      },
    });
    setLoader(false);
  }, [data]);
  useEffect(() => {
    const rows = data?.filterPublicationsPaginated?.data || [];
    const columns = makeColumns();

    setData({ rows, columns });
  }, [data]);

  useEffect(() => {
    if (filters) {
      getPulications({
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

  const handlePagination = (page: number) => {
    getPulications({
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

  const handleFilters = (key: string, val: any) => {
    setFilters({
      ...filters,
      [key]: val,
    });
  };

  return (
    <>
      <DashboardNavbar text="Add Publication" onsubmit={!openForm && (() => setOpenForm(true))} />

      <MDBox px={2}>
        {!openForm && (
          <MDBox pt={2} display="flex" alignItems="center" justifyContent="space-between">
            <MDTypography fontWeight="bold" fontSize="20px">
              Publications
            </MDTypography>
          </MDBox>
        )}
        <Filters handleFilters={handleFilters} filters={filters} />

        <MDBox pt={openForm ? 3 : 2} pb={3}>
          {loader ? (
            <Card sx={{ minHeight: "300px" }}>
              <MDCircularLoader overlayloader startLoader />
            </Card>
          ) : openForm ? (
            <Card sx={{ minHeight: "300px" }}>
              <PublicationForm onClose={() => setOpenForm(false)} refetch={refetch} id={openForm} />
            </Card>
          ) : data?.filterPublicationsPaginated?.data?.length ? (
            <DataTable
              loading={loading}
              handlePagination={handlePagination}
              canSearch
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
export default Publications;

import { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import DataTable from "../pr-management/components/DataTable";
import { useLazyQuery } from "@apollo/client";
import { IGetUsers, IGetUsersVars, GET_USERS } from "graphql/queries/filterUsersPaginated";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { makeColumns } from "./components/makeColumns";
import MDInput from "components/MDInput";
import SearchIcon from "assets/images/icons/searchIcon.svg";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import UpdateBalanceModal from "./components/UpdateBalanceModal";

const PER_PAGE = 10;
const UserManagement = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<any>({});
  const [q, setQ] = useState<any>("");
  const [tableData, setData] = useState<any>({ rows: [], columns: [] });
  const [intLoader, setInitLoader] = useState<boolean>(false);
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const [pageSize, setSize] = useState<number>(10);
  const [open, setOpen] = useState<any>(false);

  const [getUsers, { data, loading, refetch }] = useLazyQuery<IGetUsers, IGetUsersVars>(GET_USERS, {
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setPaginationInfo(res?.filterUsersPaginated?.paginationInfo);
    },
  });

  useEffect(() => {
    if (filters) {
      getUsers({
        variables: {
          paginationInput: {
            perPage: pageSize,
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
    setInitLoader(true);
    getUsers({
      variables: {
        filterInput: filters,
        paginationInput: {
          currentPage: 0,
          perPage: pageSize,
        },
      },
    }).then(() => {
      setInitLoader(false);
    });
  }, [pageSize]);

  useEffect(() => {
    const rows = data?.filterUsersPaginated?.data || [];
    const columns = makeColumns(navigate, setOpen);
    setData({ rows, columns });
  }, [data]);

  const checkPrIdAvail = useCallback(
    debounce((val: string) => {
      setFilters({ fullName: val });
    }, 500),
    []
  );
  const handleInputChange = (evt: any) => {
    const searchTerm = evt.target.value || "";
    setQ(searchTerm);
    checkPrIdAvail(searchTerm);
  };

  const handlePagination = (page: number) => {
    getUsers({
      variables: {
        paginationInput: {
          perPage: pageSize,
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
      <MDBox>
        <MDBox pt={2} pb={3} px={2}>
          <MDBox mb={2}>
            <MDInput
              sx={{ width: 252 }}
              fullWidth
              type="text"
              onChange={handleInputChange}
              value={q}
              placeholder="Search User"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img height={15} width={15} src={SearchIcon} alt="Search" />
                  </InputAdornment>
                ),
              }}
            />
          </MDBox>
          {intLoader ? (
            <Card sx={{ minHeight: "300px" }}>
              <MDCircularLoader overlayloader startLoader />
            </Card>
          ) : loading || !!data?.filterUsersPaginated?.data?.length ? (
            <DataTable
              loading={loading}
              handlePagination={handlePagination}
              canSearch
              table={tableData}
              showHeader
              paginationInfo={paginationInfo}
              entriesPerPage={{ defaultValue: pageSize }}
              setSize={setSize}
              maxHeight="calc(100vh - 14rem)"
            />
          ) : (
            <Card sx={{ minHeight: "300px" }}>
              <MDBox m={"auto"}>
                <MDTypography variant="h6">No data found</MDTypography>
              </MDBox>
            </Card>
          )}
        </MDBox>
        {open && (
          <UpdateBalanceModal userId={open} onClose={() => setOpen(false)} refetch={refetch} />
        )}
      </MDBox>
    </>
  );
};
export default UserManagement;

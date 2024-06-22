import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import DataTable from "./components/DataTable";
import { useMutation, useLazyQuery } from "@apollo/client";
import {
  GET_ARTICLES,
  IGetArticles,
  IGetArticlesVars,
} from "graphql/queries/filterArticlesPaginated";
import PRDetail from "./components/PRDetail";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { makeColumns } from "./components/makeColumns";
import {
  UPDATE_ARTICLE_STATUS,
  IUpdateArticleStatusVars,
} from "graphql/mutations/updateArticleStatus";
import NoteModal from "./components/NoteModal";
import Filters from "./components/Filters";
import { useLocation, useNavigate } from "react-router-dom";
import ArticleBundleModal from "../releases/components/ArticleBundleModal";

const PER_PAGE = 10;

const PRManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uEmail = queryParams.get("email") || "";
  const uId = queryParams.get("userID") || "";

  const [filters, setFilters] = useState<any>({});
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const [updateArticleStatus] = useMutation<IUpdateArticleStatusVars>(UPDATE_ARTICLE_STATUS);

  const [getArticles, { data, loading, refetch }] = useLazyQuery<IGetArticles, IGetArticlesVars>(
    GET_ARTICLES,
    {
      fetchPolicy: "network-only",
      onCompleted: (res) => {
        setPaginationInfo(res?.filterArticlesPaginated?.paginationInfo);
      },
    }
  );

  const [loader, setLoader] = useState<boolean>(false);
  const [initLoading, setInitLoader] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [options, setOptions] = useState<any>([]);
  const [noteModal, setNoteModal] = useState<any>(null);
  const [viewModal, setViewModal] = useState<any>(null);

  const [openForm, setOpenForm] = useState<any>(id || false);
  const [tableData, setData] = useState<any>({ rows: [], columns: [] });

  useEffect(() => {
    if (uId && uEmail) {
      setOptions({
        userId: uId,
        email: uEmail,
      });
      setEmail(uEmail);
      setFilters([
        {
          ...filters,
          userId: uId,
        },
      ]);
    }
  }, [uEmail, uId]);

  useEffect(() => {
    setInitLoader(true);
    getArticles({
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
      getArticles({
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

  const handleUpdateStatus = (row: any, status: string, notes?: string) => {
    const id = row?.original?.id;
    if (status === "AWAITING_APPROVAL" && !notes) {
      setNoteModal({ ...row, status });
      return;
    }
    setLoader(true);
    updateArticleStatus({
      variables: {
        params: {
          id,
          status,
          notes,
        },
      },
    })
      .then(() => {
        setLoader(false);
        refetch();
        toast.success("Status Updated successfully");
      })
      .catch((err) => {
        toast.error(err?.message);
        setLoader(false);
      });
  };

  const handleFilters = (key: string, val: any) => {
    setFilters({
      ...filters,
      [key]: val,
    });
  };

  const handleAction = (id: string, action: string) => {
    if (action === "edit") {
      setOpenForm(id);
    } else if (action === "navigate") {
      navigate(`/download-report?id=${id}`);
    } else if (action === "view") {
      setViewModal(id);
    }
  };

  useEffect(() => {
    setLoader(true);
    const articles = data?.filterArticlesPaginated?.data;
    const rows: any = articles || [];
    const columns = makeColumns(
      handleAction,
      handleUpdateStatus,
      handleFilters,
      setEmail,
      setOptions,
      filters
    );

    setData({ rows, columns });
    setLoader(false);
  }, [data]);

  const handlePagination = (page: number) => {
    getArticles({
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
      {loader && <MDCircularLoader overlayloader startLoader />}
      <DashboardNavbar />
      <MDBox sx={{ display: "flex", flexDirection: "column" }}>
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

        <MDBox px={2} pt={openForm ? 3 : 2} pb={3} sx={{ flex: 1 }}>
          {initLoading ? (
            <Card sx={{ minHeight: "300px" }}>
              <MDCircularLoader overlayloader startLoader />
            </Card>
          ) : openForm ? (
            <Card sx={{ minHeight: "300px" }}>
              <PRDetail
                onClose={() => {
                  setOpenForm(false);
                  refetch();
                }}
                refetch={refetch}
                id={openForm}
              />
            </Card>
          ) : loading || !!data?.filterArticlesPaginated?.data?.length ? (
            <Box
              sx={{
                flex: 1,
                // height: "70vh",
              }}
            >
              <DataTable
                handlePagination={handlePagination}
                canSearch
                table={tableData}
                showHeader
                loading={loading}
                paginationInfo={paginationInfo || {}}
              />
            </Box>
          ) : (
            <Card sx={{ minHeight: "300px" }}>
              <MDBox m={"auto"}>
                <MDTypography variant="h6">No data found</MDTypography>
              </MDBox>
            </Card>
          )}
        </MDBox>
      </MDBox>
      {noteModal && (
        <NoteModal
          onClose={() => setNoteModal(null)}
          handleSubmit={(note: string) => {
            handleUpdateStatus(noteModal, noteModal.status, note);
            setNoteModal(null);
          }}
        />
      )}
      {viewModal && <ArticleBundleModal onClose={() => setViewModal(null)} articleId={viewModal} />}
    </>
  );
};
export default PRManagement;

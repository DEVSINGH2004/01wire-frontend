import { useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
// Material Dashboard 2 PRO React TS examples components
import ReleaseForm from "./components/ReleaseForm";
// Data
import { useState } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  GET_ARTICLES,
  IGetArticles,
  IGetArticlesVars,
} from "graphql/queries/filterArticlesPaginated";
import { GET_CLIENTS, IGetClientsVars, IGetClients } from "graphql/queries/filterClientsPaginated";
import { DELETE_ARTICLE, IDeleteArticleVars } from "graphql/mutations/deleteArticle";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "../pr-management/components/DataTable";
import NoteModal from "../pr-management/components/NoteModal";
import { makeColumns } from "./components/makeColumns";
import Filters from "./components/Filters";
import {
  UPDATE_ARTICLE_STATUS,
  IUpdateArticleStatusVars,
} from "graphql/mutations/updateArticleStatus";
import ArticleBundleModal from "./components/ArticleBundleModal";
import MessageModal from "./components/MessageModal";
import DeleteModal from "examples/DeleteModal";
import { statusOptions } from "constants/index";

const PER_PAGE = 10;
function Releases(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const estimation = location?.state?.estimation;
  const PRStatus = location?.state?.status;
  const selectedStatus = statusOptions?.filter((one) => one?.value === PRStatus);
  const [loader, setLoader] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<any>((estimation && true) || id || false);
  const [tableData, setData] = useState<any>({ rows: [], columns: [] });
  const [filters, setFilters] = useState<any>(PRStatus ? { status: selectedStatus } : {});
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const [initLoading, setInitLoader] = useState<boolean>(false);
  const [noteModal, setNoteModal] = useState<any>(null);
  const [viewModal, setViewModal] = useState<any>(null);
  const [open, setOpen] = useState<any>(false);
  const [deleteConf, setDeleteConf] = useState<any>(false);
  const [pageSize, setSize] = useState<number>(10);
  const [updateArticleStatus] = useMutation<IUpdateArticleStatusVars>(UPDATE_ARTICLE_STATUS);
  const [deleteArticle] = useMutation<IDeleteArticleVars>(DELETE_ARTICLE);

  const [getArticles, { data: articlesData, loading, refetch }] = useLazyQuery<
    IGetArticles,
    IGetArticlesVars
  >(GET_ARTICLES, {
    onCompleted: (res) => {
      setPaginationInfo(res?.filterArticlesPaginated?.paginationInfo);
    },
    // skip: !!id,
    fetchPolicy: "network-only",
  });
  const { data: clientsData } = useQuery<IGetClients, IGetClientsVars>(GET_CLIENTS, {
    variables: {
      filterInput: {},
      paginationInput: {
        currentPage: 0,
        perPage: 200,
      },
    },
  });
  const clientsOptions: any = clientsData?.filterClientsPaginated?.data?.map((el) => ({
    label: el?.title,
    value: el?.id,
  }));
  if (clientsOptions?.length) {
    clientsOptions.push({
      label: "None",
      value: "",
    });
  }
  const getStatusArr = (arr: any) => {
    if (!arr?.length) return [];
    return arr?.map((one: any) => one?.value);
  };
  useEffect(() => {
    setInitLoader(true);
    getArticles({
      variables: {
        paginationInput: {
          perPage: pageSize,
          currentPage: 0,
        },
        filterInput: {},
      },
    })
      .then(() => setInitLoader(false))
      .catch(() => setInitLoader(false));
  }, [pageSize]);

  useEffect(() => {
    if (filters) {
      const status = getStatusArr(filters?.status);
      const filterObj = { ...filters, status };
      if (!filterObj?.status?.length) {
        delete filterObj.status;
      }
      getArticles({
        variables: {
          paginationInput: {
            perPage: PER_PAGE,
            currentPage: 0,
          },
          filterInput: filterObj,
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
      .catch((err: any) => {
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
  const handleDelete = (id: string) => {
    if (!id) return;
    setLoader(true);
    deleteArticle({
      variables: {
        id,
      },
    })
      .then((res) => {
        setLoader(false);
        refetch();
        toast.success("Deleted Successfully.");
      })
      .catch((err) => {
        toast.error(err?.message);
        setLoader(false);
      });
  };
  const handleAction = (id: string, action: string, row: string) => {
    if (action === "edit") {
      navigate(`/releases/${id}`);
      setOpenForm(id);
    } else if (action === "view") {
      setViewModal(id);
    } else if (action === "navigate") {
      navigate(`/download-report?id=${id}`);
    } else if (action === "delete") {
      setDeleteConf(id);
    }
  };
  useEffect(() => {
    const rows = articlesData?.filterArticlesPaginated?.data || [];
    const columns = makeColumns(handleAction, handleUpdateStatus, setOpen);
    setData({ rows, columns });
  }, [articlesData]);

  useEffect(() => {
    if (location?.pathname === "/releases" && !estimation) {
      setOpenForm(false);
    }
  }, [id]);

  const handlePagination = (page: number) => {
    const status = getStatusArr(filters?.status);
    const filterInput = { ...filters, status };
    if (!filterInput?.status?.length) {
      delete filterInput.status;
    }
    getArticles({
      variables: {
        paginationInput: {
          perPage: pageSize,
          currentPage: page,
        },
        filterInput,
      },
    });
  };

  return (
    <>
      {loader && <MDCircularLoader overlayloader startLoader />}

      <DashboardNavbar text="ADD PR" onsubmit={!openForm && (() => setOpenForm(true))} />
      <MDBox px={2}>
        {!openForm && (
          <>
            <Filters
              setFilters={setFilters}
              handleFilters={handleFilters}
              filters={filters}
              clientsOptions={clientsOptions}
            />
          </>
        )}
        <MDBox pt={openForm ? 6 : 2} sx={{ minHeight: "520px" }}>
          {initLoading || loading ? (
            <Card sx={{ minHeight: "300px" }}>
              <MDCircularLoader overlayloader startLoader />
            </Card>
          ) : openForm ? (
            <Card sx={{ minHeight: "300px" }}>
              <ReleaseForm idVal={openForm} onClose={() => setOpenForm(false)} refetch={refetch} />
            </Card>
          ) : tableData?.rows?.length ? (
            <MDBox>
              <DataTable
                handlePagination={handlePagination}
                canSearch
                table={tableData}
                showHeader
                loading={loading}
                paginationInfo={paginationInfo || {}}
                entriesPerPage={{ defaultValue: pageSize }}
                setSize={setSize}
                maxHeight="calc(100vh - 14rem)"
              />
            </MDBox>
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
      {open && <MessageModal message={open} onClose={() => setOpen(false)} />}
      {deleteConf && (
        <DeleteModal
          onClose={() => setDeleteConf(null)}
          handleSubmit={() => {
            handleDelete(deleteConf);
            setDeleteConf(null);
          }}
        />
      )}
    </>
  );
}

export default Releases;

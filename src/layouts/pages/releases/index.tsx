import { useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import EditIcon from "assets/images/icons/editIcon.svg";
import DeleteIcon from "assets/images/icons/deleteIcon.svg";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import MDCircularLoader from "components/MDCircularLoader";
// Material Dashboard 2 PRO React TS examples components
import Footer from "examples/Footer";
import Autocomplete from "@mui/material/Autocomplete";
import ReleaseForm from "./components/ReleaseForm";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
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

const ReleaseTypeOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Awaiting Approval", value: "AWAITING_APPROVAL" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "None", value: "" },
];

const ActionsCellRenderer = ({ actions = [] }: { actions: any }) => (
  <MDBox display="flex" alignItems="center" justifyContent="space-between">
    {actions?.map((one: any, i: any) => {
      return (
        <IconButton key={i} onClick={one?.onClick}>
          <img src={one?.Icon} height="36px" width="36px" />
        </IconButton>
      );
    })}
  </MDBox>
);

const PER_PAGE = 10;
function Releases(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const estimation = location?.state?.estimation;

  const [loader, setLoader] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>({});
  const [openForm, setOpenForm] = useState<any>((estimation && true) || id || false);
  const [tableData, setData] = useState<any>({ rows: [], columns: [] });
  const [filters, setFilters] = useState<any>({});
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const [initLoading, setInitLoader] = useState<boolean>(false);
  const [noteModal, setNoteModal] = useState<any>(null);

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

  const handleAction = (id: string, action: string) => {
    if (action === "edit") {
      setOpenForm(id);
    }
  };

  useEffect(() => {
    const rows = articlesData?.filterArticlesPaginated?.data || [];
    const columns = makeColumns(handleAction, handleUpdateStatus);
    // if (articles?.length) {
    //   rows = articles?.map((one) => {
    //     return {
    //       featureImage: `${process.env.REACT_APP_IMAGE_BASE_URL}${one?.featureImage}`,
    //       title: {
    //         title: one?.title,
    //         desc: one?.summary,
    //       },
    //       status: one?.status,
    //       actions: [
    //         {
    //           Icon: EditIcon,
    //           onClick: () => {
    //             navigate(`/releases/${one?.id}`);
    //             setOpenForm(one?.id);
    //           },
    //         },
    //         {
    //           Icon: DeleteIcon,
    //           onClick: () => {
    //             deleteArticle({
    //               variables: {
    //                 id: one?.id,
    //               },
    //             })
    //               .then(() => {
    //                 refetch();
    //                 toast.success("Deleted Successfully");
    //               })
    //               .catch((err) => {
    //                 toast.error(err?.message);
    //               });
    //           },
    //         },
    //       ],
    //     };
    //   });
    // }
    setData({ rows, columns });
  }, [articlesData]);

  // useEffect(() => {
  //   if (location?.pathname === "/releases") {
  //     setOpenForm(false);
  //   }
  // }, [location]);

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
        <MDBox pt={openForm ? 6 : 2} pb={3} sx={{ minHeight: "520px" }}>
          {initLoading ? (
            <Card sx={{ minHeight: "300px" }}>
              <MDCircularLoader overlayloader startLoader />
            </Card>
          ) : openForm ? (
            <Card sx={{ minHeight: "300px" }}>
              <ReleaseForm idVal={openForm} />
            </Card>
          ) : tableData?.rows?.length ? (
            <DataTable
              handlePagination={handlePagination}
              canSearch
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
        <Footer />
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
    </>
  );
}

export default Releases;

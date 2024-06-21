import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import { toast } from "react-toastify";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_PUBLICATIONS,
  IGetPublications,
  IGetPublicationsVars,
} from "graphql/queries/filterPublicationsPaginated";
import PublicationForm from "./components/PublicationForm";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { makeColumns } from "./components/makeColumns";
import DataTable from "../pr-management/components/DataTable";
import Filters from "./components/Filters";
import DeleteModal from "examples/DeleteModal";
import { DELETE_PUBLICATION, IDeletePublicationVars } from "graphql/mutations/deletePublication";
import {
  UPDATE_PUBLICATION_VISIBILITY,
  IUpdatePublicationVisVars,
} from "graphql/mutations/updatePublicationVisibility";

const PER_PAGE = 10;
const Publications = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [paginationInfo, setPaginationInfo] = useState<any>({});

  const [tableData, setData] = useState<any>({ rows: [], columns: [] });
  const [loader, setLoader] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<any>(id || false);
  const [filters, setFilters] = useState<any>({});
  const [deleteConf, setDeleteConf] = useState<any>(null);

  const [updateVisibility, { loading: updateLoader }] = useMutation<IUpdatePublicationVisVars>(
    UPDATE_PUBLICATION_VISIBILITY
  );

  const [deletePublication, { loading: deleteLoader }] =
    useMutation<IDeletePublicationVars>(DELETE_PUBLICATION);

  const [getPublications, { data, loading, refetch }] = useLazyQuery<
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
    getPublications({
      variables: {
        filterInput: {},
        paginationInput: {
          currentPage: 0,
          perPage: PER_PAGE,
        },
      },
    })
      .then(() => setLoader(false))
      .catch(() => setLoader(false));
  }, []);

  const handleAction = (id: string, action: string) => {
    if (action === "edit") {
      setOpenForm(id);
    } else {
      setDeleteConf(id);
    }
  };

  const handleUpdateStatus = (row: any, visibility: string) => {
    const id = row?.original?.id;
    updateVisibility({
      variables: {
        id,
        visibility,
      },
    })
      .then(() => {
        refetch();
        toast.success("Status Updated successfully");
      })
      .catch((err: any) => {
        toast.error(err?.message);
      });
  };

  useEffect(() => {
    const rows = data?.filterPublicationsPaginated?.data || [];
    const columns = makeColumns(handleAction, handleUpdateStatus);

    setData({ rows, columns });
  }, [data]);

  useEffect(() => {
    if (filters) {
      getPublications({
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
    getPublications({
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

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    deletePublication({
      variables: {
        id,
      },
    })
      .then(() => {
        refetch();
        toast.success("Deleted Successfully");
      })
      .catch((err: any) => {
        toast.error(err?.message);
      });
  };

  return (
    <>
      {(deleteLoader || updateLoader) && <MDCircularLoader overlayloader startLoader />}
      <DashboardNavbar text="Add Publication" onsubmit={!openForm && (() => setOpenForm(true))} />
      <MDBox px={2}>
        {!openForm && (
          <>
            <Filters handleFilters={handleFilters} filters={filters} />
          </>
        )}

        <MDBox pt={openForm ? 3 : 2} pb={3}>
          {loader ? (
            <Card sx={{ minHeight: "300px" }}>
              <MDCircularLoader overlayloader startLoader />
            </Card>
          ) : openForm ? (
            <Card sx={{ minHeight: "300px" }}>
              <PublicationForm
                onClose={() => {
                  setOpenForm(false);
                  refetch();
                }}
                refetch={refetch}
                id={openForm}
              />
            </Card>
          ) : loading || !!data?.filterPublicationsPaginated?.data?.length ? (
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
};
export default Publications;

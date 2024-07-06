import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// Material Dashboard 2 PRO React TS examples components
import ClientForm from "./components/ClientForm";
import { useLazyQuery } from "@apollo/client";
import { GET_CLIENTS, IGetClientsVars, IGetClients } from "graphql/queries/filterClientsPaginated";
import MDCircularLoader from "components/MDCircularLoader";

import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { DELETE_CLIENT, IDeleteClientVars } from "graphql/mutations/deleteClient";
import DataTable from "../pr-management/components/DataTable";
import { makeColumns } from "./components/makeColumns";
import DeleteModal from "examples/DeleteModal";

const PER_PAGE = 10;

const ActionsCellRenderer = ({ actions = [] }: { actions: any }) => (
  <MDBox display="flex" alignItems="center" justifyContent="space-between">
    {actions?.map((one: any, i: any) => {
      return (
        <IconButton key={i} onClick={one?.onClick}>
          {one?.imgIcon ? <img src={one.imgIcon} height="36px" width="36px" /> : one?.Icon}
        </IconButton>
      );
    })}
  </MDBox>
);

function Clients(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState<any>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [tableData, setData] = useState<any>([]);
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const [deleteConf, setDeleteConf] = useState<any>(null);
  const [pageSize, setSize] = useState<number>(10);
  const [deleteClient, { loading: deleteLoader }] = useMutation<IDeleteClientVars>(DELETE_CLIENT);
  const [getClients, { data: clientsData, loading, refetch }] = useLazyQuery<
    IGetClients,
    IGetClientsVars
  >(GET_CLIENTS, {
    // skip: !!id,
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setPaginationInfo(res?.filterClientsPaginated?.paginationInfo);
    },
  });

  useEffect(() => {
    setLoader(true);
    getClients({
      variables: {
        paginationInput: {
          perPage: pageSize,
          currentPage: 0,
        },
        filterInput: {},
      },
    })
      .then(() => setLoader(false))
      .catch(() => setLoader(false));
  }, [pageSize]);

  const handleAction = (id: string, action: string) => {
    if (action === "edit") {
      navigate(`/clients/${id}`);
      setOpenForm(id);
    } else {
      setDeleteConf(id);
    }
  };

  useEffect(() => {
    const rows = clientsData?.filterClientsPaginated?.data || [];
    const columns = makeColumns(handleAction);
    setData({ rows, columns });
  }, [clientsData]);

  useEffect(() => {
    if (id) {
      setOpenForm(id);
    } else {
      setOpenForm(false);
    }
  }, [id]);
  const handleDeleteClient = (clientId: string | undefined) => {
    if (!clientId) return;
    deleteClient({
      variables: {
        id: clientId,
      },
    })
      .then(() => {
        refetch();
        toast.success("Deleted Successfully");
      })
      .catch((err) => {
        toast.error(err?.message);
      });
  };

  const handlePagination = (page: number) => {
    getClients({
      variables: {
        paginationInput: {
          perPage: pageSize,
          currentPage: page,
        },
        filterInput: {},
      },
    });
  };

  return (
    <>
      {deleteLoader && <MDCircularLoader overlayloader startLoader />}
      <DashboardNavbar text="Add New Client" onsubmit={!openForm && (() => setOpenForm(true))} />
      <MDBox px={2}>
        <MDBox pt={openForm ? 6 : 2} sx={{ minHeight: "570px" }}>
          {loader ? (
            <Card sx={{ minHeight: "400px" }}>
              <MDCircularLoader overlayloader startLoader />
            </Card>
          ) : openForm ? (
            <Card>
              <ClientForm id={openForm} onClose={() => setOpenForm(false)} refetchList={refetch} />
            </Card>
          ) : loading || clientsData?.filterClientsPaginated?.data?.length ? (
            <DataTable
              loading={loading}
              handlePagination={handlePagination}
              table={tableData}
              showHeader
              paginationInfo={paginationInfo || {}}
              entriesPerPage={{ defaultValue: pageSize }}
              setSize={setSize}
              maxHeight="calc(100vh - 10rem)"
            />
          ) : (
            <Card sx={{ minHeight: "400px" }}>
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
            handleDeleteClient(deleteConf);
            setDeleteConf(null);
          }}
        />
      )}
    </>
  );
}

export default Clients;

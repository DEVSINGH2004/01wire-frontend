import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import EditIcon from "@mui/icons-material/Edit";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import ClientForm from "./components/ClientForm";
import { useQuery } from "@apollo/client";
import productImage from "assets/images/products/product-11.jpg";
import { GET_CLIENTS, IGetClientsVars, IGetClients } from "graphql/queries/filterClientsPaginated";
import MDCircularLoader from "components/MDCircularLoader";

const ActionsCellRenderer = ({ actions = [] }: { actions: any }) => (
  <MDBox display="flex" alignItems="center" justifyContent="space-between">
    {actions?.map((one: any, i: any) => {
      return (
        <IconButton key={i} onClick={one?.onClick}>
          {one?.Icon}
        </IconButton>
      );
    })}
  </MDBox>
);
const columns = [
  {
    Header: "name",
    accessor: "name",
    width: "90%",
    Cell: ({ value }: any) => {
      return (
        <MDBox display="flex" alignItems="center">
          <MDBox
            mr={2}
            component="img"
            src={
              value?.logo ? `${process.env.REACT_APP_IMAGE_BASE_URL}${value?.logo}` : productImage
            }
            alt="Product Image"
            borderRadius="lg"
            shadow="sm"
            width="127px"
            height="53px"
            position="relative"
          />
          <MDTypography fontSize="16px">{value.title}</MDTypography>
        </MDBox>
      );
    },
  },
  {
    Header: "",
    accessor: "actions",
    width: "10%",
    Cell: ({ value }: { value: any }) => <ActionsCellRenderer actions={value} />,
  },
];

function Releases(): JSX.Element {
  const [openForm, setOpenForm] = useState<any>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [tableData, setData] = useState<any>([]);

  const {
    data: clientsData,
    loading,
    refetch,
  } = useQuery<IGetClients, IGetClientsVars>(GET_CLIENTS, {
    variables: {
      filterInput: {},
      paginationInput: {
        currentPage: 0,
        perPage: 200,
      },
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const clients = clientsData?.filterClientsPaginated?.data;
    let rows: any = [];
    if (clients?.length) {
      rows = clients?.map((one) => {
        return {
          name: one,
          actions: [
            {
              Icon: <EditIcon fontSize="small" />,
              onClick: () => {
                setOpenForm(one?.id);
              },
            },
            // {
            //   Icon: <DeleteOutlineIcon fontSize="small" />,
            //   onClick: () => {
            //     console.log("delete clicked");
            //   },
            // },
          ],
        };
      });
    }
    setData({ rows, columns });
    setLoader(false);
  }, [clientsData]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {!openForm && (
        <MDBox display="flex" alignItems="center" justifyContent="flex-end" pt={2}>
          <MDButton
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setOpenForm(true)}
          >
            Add New Client <AddCircleOutlineRoundedIcon sx={{ ml: 0.5 }} />
          </MDButton>
        </MDBox>
      )}
      <MDBox pt={openForm ? 6 : 2} pb={3}>
        <Card sx={{ minHeight: "400px" }}>
          {loading || loader ? (
            <MDCircularLoader overlayloader startLoader />
          ) : openForm ? (
            <ClientForm id={openForm} onClose={() => setOpenForm(false)} refetchList={refetch} />
          ) : tableData?.rows?.length ? (
            <DataTable showHeader={false} table={tableData} />
          ) : (
            <MDBox m={"auto"}>
              <MDTypography variant="h6">No data found</MDTypography>
            </MDBox>
          )}
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Releases;

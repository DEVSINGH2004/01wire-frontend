import { useEffect } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import MDCircularLoader from "components/MDCircularLoader";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Autocomplete from "@mui/material/Autocomplete";

import ReleaseForm from "./components/ReleaseForm";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

// Data
import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_ARTICLES,
  IGetArticles,
  IGetArticlesVars,
} from "graphql/queries/filterArticlesPaginated";
import EditIcon from "assets/images/icons/editIcon.png";

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

const columns = [
  {
    Header: "featureImage",
    accessor: "featureImage",
    width: "10%",
    Cell: ({ value }: { value: string }) => (
      <MDAvatar
        src={value}
        variant="rounded"
        sx={{
          height: "53px",
          width: "127px",
          borderRadius: "4px",
        }}
      />
    ),
  },
  { Header: "title", accessor: "title", width: "50%" },
  {
    Header: "status",
    accessor: "status",
    width: "20%",
    Cell: ({ value }: { value: any }) => (
      <MDBox borderRadius="section" py={"5px"} px={"12px"} bgColor={"light"}>
        <MDTypography
          variant="caption"
          fontWeight={"medium"}
          color={
            value === "SCHEDULED"
              ? "success"
              : ["AWAITING_APPROVAL", "IN_REVIEW"].includes(value)
              ? "info"
              : "primary"
          }
        >
          {value}
        </MDTypography>
      </MDBox>
    ),
  },
  {
    Header: "actions",
    accessor: "actions",
    width: "20%",
    Cell: ({ value }: { value: any }) => <ActionsCellRenderer actions={value} />,
  },
];
function Releases(): JSX.Element {
  const [client, setClient] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<any>(false);
  const [tableData, setData] = useState<any>({ rows: [], columns });
  const { data: articlesData, loading } = useQuery<IGetArticles, IGetArticlesVars>(GET_ARTICLES, {
    variables: {
      filterInput: {},
      paginationInput: {
        currentPage: 0,
        perPage: 200,
      },
    },
    fetchPolicy: "network-only",
  });
  console.log("articlesData", articlesData);
  useEffect(() => {
    setLoader(true);
    const articles = articlesData?.filterArticlesPaginated?.data;
    if (articles?.length) {
      const rows = articles?.map((one) => {
        return {
          featureImage: `${process.env.REACT_APP_IMAGE_BASE_URL}${one?.featureImage}`,
          title: one?.title,
          status: one?.status,
          actions: [
            {
              Icon: EditIcon,
              onClick: () => {
                console.log("edit clicked");
                // navigate(`/releases/${one?.id}`);
                setOpenForm(one?.id);
              },
            },
          ],
        };
      });
      setData({ rows, columns });
    }
    setLoader(false);
  }, [articlesData]);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {!openForm && (
        <>
          <MDBox display="flex" alignItems="center" justifyContent="space-between" pt={2}>
            <MDBox display="flex">
              <Autocomplete
                disableClearable
                value={client}
                options={["Client", "Test"]}
                onChange={(event, newValue) => {
                  setClient(newValue);
                }}
                size="small"
                sx={{ width: "5rem" }}
                renderInput={(params) => <MDInput {...params} />}
              />
              <MDBox pl={2}>
                <Autocomplete
                  disableClearable
                  value={client}
                  options={["Release Type", "Test"]}
                  onChange={(event, newValue) => {
                    setClient(newValue);
                  }}
                  size="small"
                  sx={{ width: "7.6rem" }}
                  renderInput={(params) => <MDInput {...params} />}
                />
              </MDBox>
            </MDBox>
            <MDButton
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setOpenForm(true)}
            >
              Add PR
              <AddCircleOutlineRoundedIcon sx={{ ml: 0.5 }} />
            </MDButton>
          </MDBox>
          <MDBox pt={2}>
            <MDTypography fontWeight="bold" fontSize="20px">
              Manage Press Release
            </MDTypography>
          </MDBox>
        </>
      )}

      <MDBox pt={openForm ? 6 : 2} pb={3}>
        <Card sx={{ minHeight: "300px" }}>
          {loading || loader ? (
            <MDCircularLoader overlayloader startLoader />
          ) : openForm ? (
            <ReleaseForm onClose={() => setOpenForm(false)} idVal={openForm} />
          ) : tableData?.rows?.length ? (
            <DataTable table={tableData} />
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

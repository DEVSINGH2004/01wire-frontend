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
import DataTable from "examples/Tables/DataTable";
import Autocomplete from "@mui/material/Autocomplete";
import ReleaseForm from "./components/ReleaseForm";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
// Data
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ARTICLES,
  IGetArticles,
  IGetArticlesVars,
} from "graphql/queries/filterArticlesPaginated";
import { GET_CLIENTS, IGetClientsVars, IGetClients } from "graphql/queries/filterClientsPaginated";
import { DELETE_ARTICLE, IDeleteArticleVars } from "graphql/mutations/deleteArticle";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

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

const columns = [
  {
    Header: "featureImage",
    accessor: "featureImage",
    width: "10%",
    Cell: ({ value }: { value: string }) => (
      <MDAvatar
        src={value}
        variant="rounded"
        size="xxl"
        sx={{
          // height: "53px",
          // width: "127px",
          borderRadius: "4px",
        }}
      />
    ),
  },
  {
    Header: "title",
    accessor: "title",
    width: "50%",
    Cell: ({ value }: { value: any }) => (
      <MDBox display="flex" alignItems="center">
        <MDTypography
          width={value?.title?.length > 60 ? "250px" : "auto"}
          sx={{
            color: "#B2B2B2",
          }}
        >
          {value?.title}
        </MDTypography>
        {value?.desc && (
          <MDTypography
            fontSize="16px"
            width={value?.desc?.length > 60 ? "250px" : "auto"}
            sx={{
              color: "#B2B2B2",
            }}
          >
            &nbsp;{`- ${value.desc}`}
          </MDTypography>
        )}
      </MDBox>
    ),
  },
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
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>({});
  const [openForm, setOpenForm] = useState<any>(id || false);
  const [tableData, setData] = useState<any>({ rows: [], columns });
  const [deleteArticle] = useMutation<IDeleteArticleVars>(DELETE_ARTICLE);

  const {
    data: articlesData,
    loading,
    refetch,
  } = useQuery<IGetArticles, IGetArticlesVars>(GET_ARTICLES, {
    variables: {
      filterInput: {
        ...filter,
      },
      paginationInput: {
        currentPage: 0,
        perPage: 200,
      },
    },
    skip: !!id,
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
    setLoader(true);
    const articles = articlesData?.filterArticlesPaginated?.data;
    let rows: any = [];
    if (articles?.length) {
      rows = articles?.map((one) => {
        return {
          featureImage: `${process.env.REACT_APP_IMAGE_BASE_URL}${one?.featureImage}`,
          title: {
            title: one?.title,
            desc: one?.summary,
          },
          status: one?.status,
          actions: [
            {
              Icon: EditIcon,
              onClick: () => {
                navigate(`/releases/${one?.id}`);
                setOpenForm(one?.id);
              },
            },
            {
              Icon: DeleteIcon,
              onClick: () => {
                deleteArticle({
                  variables: {
                    id: one?.id,
                  },
                })
                  .then(() => {
                    refetch();
                    toast.success("Deleted Successfully");
                  })
                  .catch((err) => {
                    toast.error(err?.message);
                  });
              },
            },
          ],
        };
      });
    }
    setData({ rows, columns });
    setLoader(false);
  }, [articlesData]);

  useEffect(() => {
    if (location?.pathname === "/releases") {
      setOpenForm(false);
    }
  }, [location]);

  return (
    <>
    <DashboardNavbar text="ADD PR" onsubmit={() => setOpenForm(true)}  />
    <MDBox px={2}>
      {!openForm && (
        <>
          <MDBox display="flex" alignItems="center" justifyContent="space-between" pt={2}>
            <MDBox display="flex">
              <Autocomplete
                disableClearable
                value={
                  filter?.clientId &&
                  clientsOptions?.find((one: any) => one?.value === filter?.clientId)
                }
                options={clientsOptions}
                onChange={(event, option: any) => {
                  if (option?.value) {
                    setFilter({ ...filter, clientId: option?.value });
                  } else {
                    const newFilter = { ...filter };
                    delete newFilter?.clientId;
                    setFilter(newFilter);
                  }
                }}
                size="small"
                sx={{ width: "12rem" }}
                renderInput={(params) => <MDInput label="Select Client" {...params} />}
              />
              <MDBox pl={2}>
                <Autocomplete
                  disableClearable
                  value={
                    filter?.status &&
                    ReleaseTypeOptions?.find((one: any) => one?.value === filter?.status)
                  }
                  options={ReleaseTypeOptions}
                  onChange={(event, option) => {
                    if (option?.value) {
                      setFilter({ ...filter, status: option?.value });
                    } else {
                      const newFilter = { ...filter };
                      delete newFilter?.status;
                      setFilter(newFilter);
                    }
                  }}
                  size="small"
                  sx={{ width: "10rem" }}
                  renderInput={(params) => <MDInput label="Select Type" {...params} />}
                />
              </MDBox>
            </MDBox>
          </MDBox>
          <MDBox pt={2}>
            <MDTypography fontWeight="bold" fontSize="20px">
              Manage Press Release
            </MDTypography>
          </MDBox>
        </>
      )}
      <MDBox pt={openForm ? 6 : 2} pb={3} sx={{ minHeight: '520px' }}>
        <Card sx={{ minHeight: "300px" }}>
          {loading || loader ? (
            <MDCircularLoader overlayloader startLoader />
          ) : openForm ? (
            <ReleaseForm idVal={openForm} />
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
    </MDBox>
    </>
  );
}

export default Releases;

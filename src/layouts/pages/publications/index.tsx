import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import MDCircularLoader from "components/MDCircularLoader";
import DataTable from "examples/Tables/DataTable";
import { useQuery } from "@apollo/client";
import {
  GET_PUBLICATIONS,
  IGetPublications,
  IGetPublicationsVars,
} from "graphql/queries/filterPublicationsPaginated";
import EditIcon from "assets/images/icons/penCircle.svg";
import { ActionsCellRenderer } from "utils/helpers";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import PublicationForm from "./components/PublicationForm";

const columns = [
  {
    Header: "Title",
    accessor: "logo",
    width: "15%",
    Cell: ({ value }: { value: any }) => (
      <MDBox>
        <MDAvatar
          src={value && `${process.env.REACT_APP_IMAGE_BASE_URL}${value}`}
          variant="rounded"
          size="xxl"
          sx={{
            borderRadius: "4px",
          }}
        />
      </MDBox>
    ),
  },
  {
    accessor: "title",
    width: "20%",
    Cell: ({ value }: { value: string }) => <MDTypography fontSize="16px">{value}</MDTypography>,
  },
  {
    Header: "Traffic",
    accessor: "traffic",
    width: "10%",
    Cell: ({ value }: { value: string }) => <MDTypography fontSize="16px">{value}</MDTypography>,
  },
  {
    Header: "Gurranted Publications",
    accessor: "gurrantedPublications",
    width: "15%",
    Cell: ({ value }: { value: string }) => <MDTypography fontSize="16px">{value}</MDTypography>,
  },
  {
    Header: "Link Type",
    accessor: "linkType",
    width: "15%",
    Cell: ({ value }: { value: string }) => (
      <MDTypography fontSize="16px">
        {value === "DO_FOLLOW" ? "Do Follow" : "No Follow"}
      </MDTypography>
    ),
  },
  {
    Header: "Price",
    accessor: "price",
    width: "10%",
    Cell: ({ value }: { value: string }) => <MDTypography fontSize="16px">{value}</MDTypography>,
  },
  {
    Header: "Check",
    accessor: "actions",
    width: "15%",
    Cell: ({ value }: { value: any }) => <ActionsCellRenderer actions={value} />,
  },
];

const Publications = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, refetch } = useQuery<IGetPublications, IGetPublicationsVars>(
    GET_PUBLICATIONS,
    {
      variables: {
        filterInput: {},
        paginationInput: {
          currentPage: 0,
          perPage: 200,
        },
      },
      fetchPolicy: "network-only",
    }
  );
  const [tableData, setData] = useState<any>({ rows: [], columns });
  const [loader, setLoader] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<any>(id || false);
  useEffect(() => {
    setLoader(true);
    const publications = data?.filterPublicationsPaginated?.data;
    const totalPublications = data?.filterPublicationsPaginated?.paginationInfo?.itemCount;
    let rows: any = [];
    if (publications?.length) {
      rows = publications?.map((one) => {
        return {
          logo: one?.image,
          title: one?.title,
          traffic: one?.stats?.traffic,
          gurrantedPublications: totalPublications || 0,
          linkType: one?.linkType,
          price: one?.price,
          actions: [
            {
              Icon: EditIcon,
              height: "16px",
              width: "16px",
              label: "Edit",
              onClick: () => {
                navigate(`/publications/${one?.id}`);
                setOpenForm(one?.id);
              },
            },
          ],
        };
      });
    }
    setData({ rows, columns });
    setLoader(false);
  }, [data]);
  return (
    <MDBox>
      {!openForm && (
        <MDBox pt={2} display="flex" alignItems="center" justifyContent="space-between">
          <MDTypography fontWeight="bold" fontSize="20px">
            Publications
          </MDTypography>
          <MDBox>
            <MDButton
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setOpenForm(true)}
            >
              Add Publication
              <AddCircleOutlineRoundedIcon sx={{ ml: 0.5 }} />
            </MDButton>
          </MDBox>
        </MDBox>
      )}
      <MDBox pt={openForm ? 3 : 2} pb={3}>
        <Card sx={{ minHeight: "300px" }}>
          {loading || loader ? (
            <MDCircularLoader overlayloader startLoader />
          ) : openForm ? (
            <PublicationForm onClose={() => setOpenForm(false)} refetch={refetch} id={openForm} />
          ) : tableData?.rows?.length ? (
            <DataTable canSearch table={tableData} />
          ) : (
            <MDBox m={"auto"}>
              <MDTypography variant="h6">No data found</MDTypography>
            </MDBox>
          )}
        </Card>
      </MDBox>
    </MDBox>
  );
};
export default Publications;

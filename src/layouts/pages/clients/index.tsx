import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
// Material Dashboard 2 PRO React TS examples components
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import ClientForm from "./components/ClientForm";
import { useQuery } from "@apollo/client";
import productImage from "assets/images/products/product-11.jpg";
import { GET_CLIENTS, IGetClientsVars, IGetClients } from "graphql/queries/filterClientsPaginated";
import MDCircularLoader from "components/MDCircularLoader";
import DeleteIcon from "assets/images/icons/deleteIcon.svg";
import EditIcon from "assets/images/icons/editIcon.svg";
import FBIcon from "assets/images/FB.svg";
import InstaIcon from "assets/images/insta.svg";
import TwitterIcon from "assets/images/twitter.svg";
import YtIcon from "assets/images/yt.svg";
import LinkedInIcon from "assets/images/LinkedIn.svg";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { DELETE_CLIENT, IDeleteClientVars } from "graphql/mutations/deleteClient";

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
const SocialMediaLink = ({ url, Icon }: { url: string | undefined; Icon: any }) => {
  return (
    <Link
      sx={{
        "& img": {
          filter: !url ? "grayscale(100%)" : "none",
        },
      }}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={Icon} height="36px" width="36px" alt="facebookIcon" />
    </Link>
  );
};
const columns = [
  {
    Header: "Title",
    accessor: "logo",
    width: "10%",
    Cell: ({ value }: any) => {
      return (
        <MDBox mr={2}>
          <MDAvatar
            src={value ? `${process.env.REACT_APP_IMAGE_BASE_URL}${value}` : productImage}
            variant="rounded"
            size="xxl"
            sx={{
              borderRadius: "4px",
            }}
          />
        </MDBox>
      );
    },
  },
  {
    Header: "",
    accessor: "title",
    width: "50%",
    Cell: ({ value }: any) => {
      return (
        <MDTypography fontSize="16px" fontWeight="regular">
          {value}
        </MDTypography>
      );
    },
  },
  {
    Header: "Social Media",
    accessor: "socialMedia",
    width: "30%",
    Cell: ({ value = {} }: any) => {
      const { facebook, instagram, twitter, youtube, linkedIn } = value;
      return (
        <MDBox display="flex" alignItems="center" justifyContent="space-between" width={"250px"}>
          <SocialMediaLink url={facebook} Icon={FBIcon} />
          <SocialMediaLink url={linkedIn} Icon={LinkedInIcon} />
          <SocialMediaLink url={twitter} Icon={TwitterIcon} />
          <SocialMediaLink url={instagram} Icon={InstaIcon} />
          <SocialMediaLink url={youtube} Icon={YtIcon} />
        </MDBox>
      );
    },
  },
  {
    Header: "Action",
    accessor: "actions",
    width: "10%",
    Cell: ({ value }: { value: any }) => <ActionsCellRenderer actions={value} />,
  },
];

function Clients(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState<any>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [tableData, setData] = useState<any>([]);
  const [deleteClient] = useMutation<IDeleteClientVars>(DELETE_CLIENT);
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
    skip: !!id,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const clients = clientsData?.filterClientsPaginated?.data;
    let rows: any = [];
    if (clients?.length) {
      rows = clients?.map((one) => {
        return {
          logo: one?.logo,
          title: one?.title,
          socialMedia: one?.social,
          actions: [
            {
              imgIcon: EditIcon,
              onClick: () => {
                navigate(`/clients/${one?.id}`);
              },
            },
            {
              imgIcon: DeleteIcon,
              onClick: () => {
                handleDeleteClient(one?.id);
              },
            },
          ],
        };
      });
    }
    setData({ rows, columns });
    setLoader(false);
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
  return (
    <>
      <DashboardNavbar text="Add New Client" onsubmit={!openForm && (() => setOpenForm(true))} />
      <MDBox px={2}>
        <MDBox pt={openForm ? 6 : 2} pb={3} sx={{ minHeight: "570px" }}>
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
      </MDBox>
    </>
  );
}

export default Clients;

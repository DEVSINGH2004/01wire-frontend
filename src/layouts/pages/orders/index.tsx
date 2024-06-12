import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDCircularLoader from "components/MDCircularLoader";
import DataTable from "examples/Tables/DataTable";
import { useQuery } from "@apollo/client";
import { GET_ORDERS, IGetOrders, IGetOrdersVars } from "graphql/queries/filterOrdersPaginated";
import EditIcon from "assets/images/icons/penCircle.svg";
import { ActionsCellRenderer } from "utils/helpers";
import OrderDetail from "./components/orderDetail";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const columns = [
  {
    Header: "PR Id",
    accessor: "prId",
    width: "15%",
    Cell: ({ value }: { value: string }) => <MDTypography fontSize="16px">{value}</MDTypography>,
  },
  {
    accessor: "title",
    width: "20%",
    Cell: ({ value }: { value: string }) => (
      <MDTypography width="200px" fontSize="16px">
        {value}
      </MDTypography>
    ),
  },
  {
    Header: "Email",
    accessor: "email",
    width: "10%",
    Cell: ({ value }: { value: string }) => <MDTypography fontSize="16px">{value}</MDTypography>,
  },
  {
    Header: "Publication",
    accessor: "publication",
    width: "15%",
    Cell: ({ value }: { value: string }) => <MDTypography fontSize="16px">{value}</MDTypography>,
  },
  {
    Header: "Publish By",
    accessor: "publishBy",
    width: "15%",
    Cell: ({ value }: { value: string }) => (
      <MDTypography fontSize="16px">{dayjs(value).format("DD MMM YYYY")}</MDTypography>
    ),
  },
  //   {
  //     Header: "Action",
  //     accessor: "actions",
  //     width: "15%",
  //     Cell: ({ value }: { value: any }) => <ActionsCellRenderer actions={value} />,
  //   },
];

const OrderManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, refetch } = useQuery<IGetOrders, IGetOrdersVars>(GET_ORDERS, {
    variables: {
      filterInput: {},
      paginationInput: {
        currentPage: 0,
        perPage: 200,
      },
    },
    fetchPolicy: "network-only",
  });
  const [tableData, setData] = useState<any>({ rows: [], columns });
  const [loader, setLoader] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<any>(id || false);
  useEffect(() => {
    setLoader(true);
    const orders = data?.filterOrdersPaginated?.data;
    let rows: any = [];
    if (orders?.length) {
      rows = orders?.map((one) => {
        return {
          prId: one?.articleId,
          title: one?.articleInfo?.title,
          email: one?.articleInfo?.mediaContact?.email,
          publication: one?.publicationInfo?.title,
          publishBy: one?.publishBy,
          //   actions: [
          //     {
          //       Icon: EditIcon,
          //       height: "16px",
          //       width: "16px",
          //       label: "Edit",
          //       onClick: () => {
          //         navigate(`/order-management/${one?.id}`);
          //         setOpenForm(one?.id);
          //       },
          //     },
          //   ],
        };
      });
    }
    setData({ rows, columns });
    setLoader(false);
  }, [data]);
  return (
    <>
    <DashboardNavbar />
    <MDBox px={2}>
      {!openForm && (
        <MDBox pt={2} display="flex" alignItems="center" justifyContent="space-between">
          <MDTypography fontWeight="bold" fontSize="20px">
            Manage Orders
          </MDTypography>
        </MDBox>
      )}
      <MDBox pt={openForm ? 3 : 2} pb={3}>
        <Card sx={{ minHeight: "300px" }}>
          {loading || loader ? (
            <MDCircularLoader overlayloader startLoader />
          ) : openForm ? (
            <OrderDetail onClose={() => setOpenForm(false)} refetch={refetch} id={openForm} />
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
    </>

  );
};
export default OrderManagement;

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDCircularLoader from "components/MDCircularLoader";
import DataTable from "examples/Tables/DataTable";
import { useQuery } from "@apollo/client";
import { GET_BUNDLES, IGetBundles, IGetBundlesVars } from "graphql/queries/filterBundlesPaginated";
import EditIcon from "assets/images/icons/penCircle.svg";
import { ActionsCellRenderer } from "utils/helpers";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import BundleForm from "./components/BundleForm";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const columns = [
  {
    Header: "Category",
    accessor: "category",
    width: "25%",
    Cell: ({ value }: { value: any }) => <MDTypography fontSize="16px">{value}</MDTypography>,
  },
  {
    Header: "Type",
    accessor: "type",
    width: "25%",
    Cell: ({ value }: { value: string }) => <MDTypography fontSize="16px">{value}</MDTypography>,
  },
  {
    Header: "Traffic",
    accessor: "traffic",
    width: "25%",
    Cell: ({ value }: { value: string }) => <MDTypography fontSize="16px">{value}</MDTypography>,
  },
  {
    Header: "Guaranteed Publications",
    accessor: "guaranteedPublications",
    width: "25%",
    Cell: ({ value }: { value: string }) => <MDTypography fontSize="16px">{value}</MDTypography>,
  },
  {
    Header: "Price",
    accessor: "price",
    width: "25%",
    Cell: ({ value }: { value: string }) => <MDTypography fontSize="16px">{value}</MDTypography>,
  },
  {
    Header: "Check",
    accessor: "actions",
    width: "20%",
    Cell: ({ value }: { value: any }) => <ActionsCellRenderer actions={value} />,
  },
];

const Bundles = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, refetch } = useQuery<IGetBundles, IGetBundlesVars>(GET_BUNDLES, {
    variables: {
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
    const bundles = data?.filterBundlesPaginated?.data;
    const totalBundles = data?.filterBundlesPaginated?.paginationInfo?.itemCount;
    let rows: any = [];
    if (bundles?.length) {
      rows = bundles.map((one) => {
        return {
          category: one?.category,
          type: one?.type,
          traffic: one?.traffic,
          guaranteedPublications: totalBundles || 0,
          price: one?.price,
          actions: [
            {
              Icon: EditIcon,
              height: "16px",
              width: "16px",
              label: "Edit",
              onClick: () => {
                navigate(`/bundles/${one?.id}`);
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
    <>
    <DashboardNavbar text="Add Bundle" onsubmit={!openForm ? () => setOpenForm(true) : undefined} />
    <MDBox px={2}>
      {!openForm && (
        <MDBox pt={2} display="flex" alignItems="center" justifyContent="space-between">
          <MDTypography fontWeight="bold" fontSize="20px">
            Bundles
          </MDTypography>
        </MDBox>
      )}
      <MDBox pt={openForm ? 3 : 2} pb={3}>
        <Card sx={{ minHeight: "300px" }}>
          {loading || loader ? (
            <MDCircularLoader overlayloader startLoader />
          ) : openForm ? (
            <BundleForm
              onClose={() => {
                navigate("/bundles");
                setOpenForm(false);
              }}
              refetch={refetch}
              id={openForm}
            />
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
export default Bundles;

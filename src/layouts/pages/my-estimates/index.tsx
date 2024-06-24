import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MDBox from "components/MDBox";
import MDCircularLoader from "components/MDCircularLoader";
import MDTypography from "components/MDTypography";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ESTIMATES,
  IGetEstimatesVars,
  IGetEstimates,
} from "graphql/queries/filterEstimatesPaginated";
import { DELETE_ESTIMATE, IDeleteEstimateVars } from "graphql/mutations/deleteEstimate";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "../pr-management/components/DataTable";
import { truncateString } from "utils/helpers";
import ShareIcon from "assets/images/icons/shareIcon.svg";
import DeleteIcon from "assets/images/icons/deleteIcon.svg";
import EditIcon from "assets/images/icons/editIcon.svg";
import { ActionsCellRenderer } from "utils/helpers";
import MDButton from "components/MDButton";
import DeleteModal from "examples/DeleteModal";

const perPage = 200;

const columns = [
  {
    Header: "Title",
    accessor: "title",
    width: "40%",
    Cell: ({ value }: { value: "string" }) => (
      <MDTypography fontWeight="medium" sx={{ fontSize: "16px", fontFamily: "Roboto" }}>
        {truncateString(value, 35)}
      </MDTypography>
    ),
  },
  {
    Header: "Publications",
    accessor: "publications",
    width: "5%",
    Cell: ({ value }: { value: any }) => (
      <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
        {value}
      </MDTypography>
    ),
  },
  {
    Header: "Bundles",
    accessor: "bundles",
    width: "5%",
    Cell: ({ value }: { value: any }) => {
      return (
        <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
          {value}
        </MDTypography>
      );
    },
  },
  {
    Header: "Views",
    accessor: "views",
    width: "5%",
    Cell: ({ value }: { value: any }) => {
      return (
        <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
          {value}
        </MDTypography>
      );
    },
  },
  {
    Header: "Reach",
    accessor: "reach",
    width: "5%",
    Cell: ({ value }: { value: any }) => {
      return (
        <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
          {value}
        </MDTypography>
      );
    },
  },
  {
    Header: "Credits",
    width: "10%",
    accessor: "credits",
    Cell: ({ value }: { value: any }) => {
      return (
        <MDTypography fontWeight="bold" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
          {value}
        </MDTypography>
      );
    },
  },
  {
    Header: "Actions",
    accessor: "actions",
    width: "30%",
    Cell: ({ value }: { value: any }) => <ActionsCellRenderer actions={value} />,
  },
];
const MyEstimates = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [tableData, setData] = useState<any>({ rows: [], columns: [] });
  const { data, refetch, loading } = useQuery<IGetEstimates, IGetEstimatesVars>(GET_ESTIMATES, {
    variables: {
      filterInput: {},
      paginationInput: {
        currentPage: currentPage,
        perPage: perPage,
      },
    },
    fetchPolicy: "network-only",
  });
  const [deleteEstimate] = useMutation<IDeleteEstimateVars>(DELETE_ESTIMATE);
  async function copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }
  const handleDelete = (id: any) => {
    if (!id) return;
    setLoader(true);
    deleteEstimate({
      variables: {
        id,
      },
    })
      .then(() => {
        setLoader(false);
        toast.success("Deleted Successfully.");
        refetch();
      })
      .catch((err: any) => {
        setLoader(false);
        toast.error(err?.message);
      });
  };
  useEffect(() => {
    let rows: any = [];
    const resData = data?.filterEstimatesPaginated?.data;
    if (resData?.length) {
      rows = resData?.map((one: any) => {
        return {
          title: one?.title,
          publications: one?.publicationIds?.length,
          bundles: one?.bundleIds?.length,
          views: 0,
          reach: one?.traffic,
          credits: one?.totalCredits,
          actions: [
            {
              imgIcon: ShareIcon,
              height: "36px",
              width: "36px",
              onClick: () => {
                copyToClipboard(`${window?.location?.origin}/share-estimation/${one?.id}`)
                  .then(() => {
                    toast.success("Copied to clipboard");
                  })
                  .catch((err: any) => {
                    toast.error(err);
                  });
              },
            },
            // {
            //   imgIcon: EditIcon,
            //   height: "36px",
            //   width: "36px",
            //   //   onClick: () => {
            //   //     navigate(`/publications/${one?.id}`);
            //   //     setOpenForm(one?.id);
            //   //   },
            // },
            {
              imgIcon: DeleteIcon,
              height: "36px",
              width: "36px",
              onClick: () => {
                setOpen(one?.id);
              },
            },
            {
              custom: (
                <MDButton
                  onClick={() => {
                    navigate("/releases", {
                      state: {
                        estimation: {
                          selectedBundles: one?.bundleInfo,
                          publicationIds: one?.publicationIds,
                        },
                      },
                    });
                  }}
                  variant="outlined"
                  color="primary"
                >
                  Create PR
                </MDButton>
              ),
            },
          ],
        };
      });
      setData({ rows, columns });
    }
  }, [data]);
  const handlePagination = (page: number) => {
    setCurrentPage(page - 1);
  };
  return (
    <MDBox>
      <DashboardNavbar text="My Estimates" />
      {open && (
        <DeleteModal
          handleSubmit={() => {
            handleDelete(open);
          }}
          onClose={() => setOpen(false)}
        />
      )}
      <MDBox px={2} py={3}>
        {loader && <MDCircularLoader startLoader overlayloader />}
        {loading ? (
          <MDCircularLoader startLoader />
        ) : data?.filterEstimatesPaginated?.data?.length > 0 ? (
          <DataTable
            canSearch
            table={tableData}
            showHeader
            paginationInfo={data?.filterEstimatesPaginated?.paginationInfo}
            handlePagination={handlePagination}
          />
        ) : (
          <MDBox sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MDTypography variant="h6">No estimation found</MDTypography>
          </MDBox>
        )}
      </MDBox>
    </MDBox>
  );
};
export default MyEstimates;

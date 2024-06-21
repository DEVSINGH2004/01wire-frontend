import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { toast } from "react-toastify";

import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import DataTable from "layouts/pages/pr-management/components/DataTable";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { truncateString } from "utils/helpers";
import MDCircularLoader from "components/MDCircularLoader";
import { GET_ORDERS, IGetOrders, IGetOrdersVars } from "graphql/queries/filterOrdersPaginated";
import { useLazyQuery } from "@apollo/client";
import { statusOptions } from "../../../pr-management/components/makeColumns";
import Divider from "@mui/material/Divider";
import axiosInstance from "utils/axiosInstance";

interface Props {
  onClose?: any;
  articleId: string;
}

const columns = [
  {
    Header: "Title",
    accessor: "articleInfo.title",
    width: "25%",
    Cell: ({ value }: any) => (
      <MDBox>
        <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
          {truncateString(value, 35)}
        </MDTypography>
      </MDBox>
    ),
  },
  {
    Header: "Status",
    width: "20%",
    accessor: "status",
    Cell: ({ value }: any) => {
      const selectedStatus = value;
      const selected = statusOptions.find((el: any) => selectedStatus === el?.value);

      return (
        <MDBox>
          <MDBox
            px={1}
            borderRadius="21px"
            bgColor={selected?.background}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: selected?.background,
              color: "white",
              backgroundBlendMode: "overlay",
              width: "140px",
              height: "22px",
            }}
          >
            <MDTypography
              sx={{
                fontSize: "12px",
                fontWeight: "400",
                color: "#fff",
              }}
            >
              {selected?.label}
            </MDTypography>
          </MDBox>
        </MDBox>
      );
    },
  },
  {
    Header: "Remark/URL",
    accessor: "notes",
    width: "40%",
    Cell: ({ value, row }: any) => (
      <MDBox>
        <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
          {row.original.status === "PUBLISHED"
            ? row.original.publicationInfo?.url
            : value
            ? truncateString(value, 70)
            : "-"}
        </MDTypography>
      </MDBox>
    ),
  },
];

const ArticleBundleModal = ({ onClose, articleId }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [loader, setLoader] = useState<any>(null);

  const [tableData, setData] = useState<any>({ rows: [], columns: [] });
  const [paginationInfo, setPaginationInfo] = useState<any>({});

  const [getOrders, { data, loading }] = useLazyQuery<IGetOrders, IGetOrdersVars>(GET_ORDERS, {
    onCompleted: (res) => {
      setPaginationInfo(res?.filterOrdersPaginated?.paginationInfo);
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getOrders({
      variables: {
        paginationInput: {
          perPage: 200,
          currentPage: 0,
        },
        filterInput: {
          articleId,
        },
      },
    });
  }, []);

  useEffect(() => {
    const rows = data?.filterOrdersPaginated?.data || [];
    setData({ rows, columns });
  }, [data]);

  const handlePagination = (page: number) => {
    getOrders({
      variables: {
        paginationInput: {
          perPage: 200,
          currentPage: page,
        },
        filterInput: {
          articleId,
        },
      },
    });
  };

  const handleFileUpload = (e: any) => {
    const file = e?.target?.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        setLoader(true);
        axiosInstance
          .post(`/order/upload-update?articleId=${articleId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            setLoader(false);
            console.log("File uploaded successfully:", response);
          })
          .catch((error) => {
            setLoader(false);
            console.error("Error uploading file:", error);
            toast.error(error?.message);
          });
      } catch (error) {
        setLoader(false);
        console.error("There was an error uploading the file:", error);
      }
    }
  };

  const handleFileDownload = async () => {
    setLoader(true);
    try {
      axiosInstance
        .get(`/order/upload-update?articleId=${articleId}`)
        .then(async (response: any) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${Date.now()}.xlsx`);
          document.body.appendChild(link);
          link.click();
          toast.success("Download successfully");
        })
        .catch((error) => {
          setLoader(false);
          toast.error(error?.message);
        });
    } catch (error) {
      setLoader(false);
      console.error("There was an error uploading the file:", error);
    }
  };
  return (
    <Dialog
      PaperProps={{
        style: {
          height: "400px",
          minWidth: isMobile ? "100%" : "1000px",
          boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.2)",
          border: "0.5px solid rgba(0, 0, 0, 0.2)",
        },
      }}
      open
      onClose={onClose}
    >
      <MDBox display="flex" alignItems="center" justifyContent="space-between">
        <DialogTitle>
          <MDTypography fontSize="16px" fontWeight="medium">
            Release Status
          </MDTypography>
        </DialogTitle>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </MDBox>
      <DialogContent
        sx={{
          textAlign: "center",
        }}
      >
        {loader && <MDCircularLoader overlayloader startLoader />}

        <MDBox sx={{ minHeight: "100px" }}>
          {loading ? (
            <MDCircularLoader startLoader />
          ) : data?.filterOrdersPaginated?.data?.length > 0 ? (
            <DataTable
              canSearch
              table={tableData}
              showHeader
              paginationInfo={paginationInfo}
              handlePagination={handlePagination}
            />
          ) : (
            <MDBox sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MDTypography variant="h6">No publications found</MDTypography>
            </MDBox>
          )}
        </MDBox>
      </DialogContent>
      <Divider />
      <DialogActions
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <Box sx={{ margin: "auto" }}>
          <input
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            id="upload-button-file"
            multiple
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-button-file">
            <MDButton
              sx={{ margin: "auto" }}
              variant="outlined"
              component="span"
              color="primary"
              // onClick={() => onClose()}
            >
              Upload Template
            </MDButton>
          </label>
        </Box>
        <MDButton
          onClick={handleFileDownload}
          sx={{ margin: "auto" }}
          variant="contained"
          color="primary"
        >
          Download Template
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default ArticleBundleModal;

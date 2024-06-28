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
import { useLazyQuery, useMutation } from "@apollo/client";
import { statusOptions } from "../../../pr-management/components/makeColumns";
import Divider from "@mui/material/Divider";
import axiosInstance from "utils/axiosInstance";
import StatusIcon from "assets/images/icons/statusIcon.svg";
import NoteModal from "../../../pr-management/components/NoteModal";
import { UPDATE_ORDER_STATUS, IUpdateOrderStatusVars } from "graphql/mutations/updateOrderStatus";
import MessageIcon from "@mui/icons-material/Message";
import MessageModal from "../MessageModal";

interface Props {
  onClose?: any;
  articleId: string;
}

const getColumns = (setNoteOpen: any,setOpen?:any) => {
  const columns = [
    {
      Header: "Title",
      accessor: "publicationInfo.title",
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
      width: "30%",
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
    {
      Header: "Action",
      Align: "right",
      width: "10%",
      Cell: ({ value, row }: any) => {
        return (
          <MDBox
            sx={{
              display: "flex",
            }}
          >
            {!["PUBLISHED", "REJECTED"].includes(row.original?.status) && (
            <IconButton
              onClick={() => setNoteOpen({ id: row.original.id })}
            >
              <img width={36} height={36} alt="navigate" src={StatusIcon} />
            </IconButton>
            )}
            {["REJECTED"].includes(row.original?.status) && (
            <IconButton
            color="primary"
            onClick={() => {
              if (row?.original?.notes) {
                setOpen(row.original.notes);
              }
            }}
            sx={{
              width: "35px",
              height: "35px",
              backgroundColor: "#f8f8fc",
              border: "1px solid #e0e0e4",
              paddingTop: "10px",
            }}
          >
            <MessageIcon sx={{ fontSize: "10px" }} />
          </IconButton>
            )}
          </MDBox>
        );
      },
    },
  ];
  return columns;
};

const ArticleBundleModal = ({ onClose, articleId }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [loader, setLoader] = useState<any>(null);
  const [noteModal, setNoteModal] = useState<any>(null);
  const [open, setOpen] = useState<any>(null);


  const [tableData, setData] = useState<any>({ rows: [], columns: [] });
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const [updateArticleStatus] = useMutation<IUpdateOrderStatusVars>(UPDATE_ORDER_STATUS);

  const [getOrders, { data, loading, refetch }] = useLazyQuery<IGetOrders, IGetOrdersVars>(
    GET_ORDERS,
    {
      onCompleted: (res) => {
        setPaginationInfo(res?.filterOrdersPaginated?.paginationInfo);
      },
      fetchPolicy: "network-only",
    }
  );

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
    const columns = getColumns(setNoteModal,setOpen);
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
          .post(`/order/upload-update`, formData, {
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
        .get(`/order/pending?articleId=${articleId}`, {
          responseType: "blob",
        })
        .then(async (response: any) => {
          const urlBlob = window.URL.createObjectURL(
            new Blob([response.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
          );
          const link = document.createElement("a");
          link.href = urlBlob;
          link.setAttribute("download", `${Date.now()}.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(urlBlob);
          toast.success("Download successfully");
          setLoader(false);
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

  const handleUpdateStatus = (row: any, status: string, notes?: string) => {
    const id = row?.id;
    let params: any = {
      id,
      status,
    };
    if (status === "PUBLISHED") {
      params = { ...params, url: notes };
    } else {
      params = { ...params, notes };
    }
    setLoader(true);
    updateArticleStatus({
      variables: {
        params,
      },
    })
      .then(() => {
        setLoader(false);
        refetch();
        toast.success("Status Updated successfully");
      })
      .catch((err) => {
        toast.error(err?.message);
        setLoader(false);
      });
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
      {noteModal && (
        <NoteModal
          orderPage
          onClose={(note?: string) => {
            handleUpdateStatus(noteModal, "REJECTED", note);
            setNoteModal(null);
          }}
          handleSubmit={(note: string) => {
            handleUpdateStatus(noteModal, "PUBLISHED", note);
            setNoteModal(null);
          }}
        />
      )}
      {open && <MessageModal message={open} onClose={() => setOpen(false)} />}
    </Dialog>
  );
};

export default ArticleBundleModal;

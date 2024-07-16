/* eslint-disable react/prop-types */
import { TableCell as MuiTableCell, IconButton } from "@mui/material";
import MDTypography from "components/MDTypography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import FormControl from "@mui/material/FormControl";
import DownloadIcon from "assets/images/icons/downloadIcon.svg";
import ViewIcon from "assets/images/icons/viewIcon.svg";
import StatusIcon from "assets/images/icons/statusIcon.svg";
import NavigateIcon from "assets/images/icons/navigateIcon.svg";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { truncateString } from "utils/helpers";

export const makeColumns = (handleAction, handleFilters, setEmail, setOptions, filters) => {
  const columns = [
    {
      Header: "PR ID",
      accessor: "prId",
      width: "7%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>{value}</MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Title",
      accessor: "articleInfo.title",
      align: "left",
      width: "28%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {truncateString(value, 35)}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Email",
      accessor: "user.email",
      width: "20%",
      Cell: ({ value, row }) => {
        return (
          <Box
            sx={{
              display: "flex",
              width: "150px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
              {truncateString(value, 20)}
            </MDTypography>
            {!filters?.userId && (
              <MDBox
                alignItems="center"
                ml={0.3}
                justifyContent="center"
                sx={{ height: "24px", width: "22px", display: "flex" }}
                bgColor="#FFDBDD"
                borderRadius={4}
              >
                {" "}
                <IconButton
                  onClick={() => {
                    setEmail(value);
                    setOptions([{ userId: row.original.articleInfo.userId, email: value }]);
                    handleFilters("userId", row.original.articleInfo.userId);
                  }}
                >
                  <FilterListOutlinedIcon />
                </IconButton>
              </MDBox>
            )}
          </Box>
        );
      },
    },
    {
      Header: "Publication /Bundles",
      accessor: "publicationInfo.title",
      width: "20%",
      Cell: ({ value, row }) => {
        return (
          <MDBox>
            <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>{value}</MDTypography>
          </MDBox>
        );
      },
    },

    {
      Header: "Publish By",
      width: "10%",
      accessor: "publishBy",
      Cell: ({ value }) => {
        return (
          <MDBox>
            <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
              {value ? dayjs(value).format("DD MMM YYYY") : "-"}
            </MDTypography>
          </MDBox>
        );
      },
    },
    {
      Header: "Action",
      align: "right",
      width: "15%",
      accessor: "status",
      Cell: ({ value, row }) => {
        return (
          <MDBox
            sx={{
              display: "flex",
            }}
          >
            {/* <IconButton
              onClick={() => handleAction(row.original.articleId, "navigate")}
              sx={{ visibility: row.original.status !== "PUBLISHED" ? "collapse" : "" }}
            >
              <img width={36} height={36} alt="navigate" src={DownloadIcon} />
            </IconButton> */}
            <IconButton
              onClick={() => handleAction(row.original.articleId, "view")}
              // sx={{
              //   visibility: !["PUBLISHED", "SCHEDULED"].includes(value) ? "collapse" : "",
              // }}
            >
              <img width={36} height={36} alt="navigate" src={ViewIcon} />
            </IconButton>
            <IconButton
              // sx={{
              //   visibility: ["PUBLISHED", "REJECTED"].includes(value) ? "collapse" : "",
              // }}
              onClick={() => handleAction(row.original.id, "note")}
            >
              <img width={36} height={36} alt="navigate" src={StatusIcon} />
            </IconButton>
            <IconButton onClick={() => handleAction(row.original.articleId, "view-article")}>
              <img width={36} height={36} alt="navigate" src={NavigateIcon} />
            </IconButton>
          </MDBox>
        );
      },
    },
  ];

  return columns;
};

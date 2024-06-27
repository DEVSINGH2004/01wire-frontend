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
import NavigateIcon from "assets/images/icons/navigateIcon.svg";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { truncateString } from "utils/helpers";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const statusOptions = [
  {
    value: "DRAFT",
    label: "Draft",
    background: `#000000`,
  },
  {
    value: "SUBMITTED",
    label: "Submitted",
    background: "#01B7F3",
  },
  {
    value: "REVIEW",
    label: "Review",
    background: "#747474",
  },
  {
    value: "AWAITING_APPROVAL",
    label: "Awaiting Approval",
    background: "#439DEE",
  },
  {
    value: "SCHEDULED",
    label: "Scheduled",
    background: "#FF9900",
  },
  {
    value: "REJECTED",
    label: "Rejected",
    background: "#FF4D53",
  },
  {
    value: "PUBLISHED",
    label: "Published",
    background: "#47BC4C",
  },
];

export const makeColumns = (
  handleAction,
  handleUpdateStatus,
  handleFilters,
  setEmail,
  setOptions,
  filters
) => {
  const columns = [
    {
      Header: "PR ID",
      accessor: "prId",
      width: "10%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>{value}</MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Title",
      accessor: "title",
      width: "15%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {truncateString(value, 15)}
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
              {truncateString(value, 17)}
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
                    setOptions([{ userId: row.original.userId, email: value }]);
                    handleFilters("userId", row.original.userId);
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
      accessor: "bundleInfo",
      width: "5%",
      Cell: ({ value, row }) => {
        // const info = `${row.original.publicationIds.length}/${row.original.bundleInfo.length}`;
        return (
          <MDBox>
            <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
              <strong>{row.original.publicationIds.length}</strong>/{row.original.bundleInfo.length}
            </MDTypography>
          </MDBox>
        );
      },
    },

    {
      Header: "Created At",
      width: "10%",
      accessor: "createdAt",
      Cell: ({ value }) => {
        return (
          <MDBox>
            <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
              {dayjs(value).format("DD MMM YYYY")}
            </MDTypography>
          </MDBox>
        );
      },
    },
    {
      Header: "Updated At",
      width: "10%",
      accessor: "updatedAt",
      Cell: ({ value }) => {
        return (
          <MDBox>
            <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
              {dayjs(value).format("DD MMM YYYY")}
            </MDTypography>
          </MDBox>
        );
      },
    },
    {
      Header: "Status",
      width: "15%",
      accessor: "status",
      Cell: ({ value, row }) => {
        const selectedStatus = value;
        const selected = statusOptions.find((el) => selectedStatus === el?.value);

        const menuOptions =
          selectedStatus === "SCHEDULED"
            ? ["SCHEDULED", "REJECTED", "PUBLISHED"]
            : selectedStatus === "SUBMITTED"
            ? ["SUBMITTED", "AWAITING_APPROVAL", "SCHEDULED"]
            : ["REVIEW", "AWAITING_APPROVAL", "SCHEDULED"];
        return (
          <MDBox>
            {["DRAFT", "AWAITING_APPROVAL", "PUBLISHED", "REJECTED"].includes(selectedStatus) ? (
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
            ) : (
              <FormControl sx={{ width: "152px", height: "22px" }} size="medium">
                <Select
                  id="demo-select-small"
                  displayEmpty
                  value={selectedStatus}
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{
                    textAlign: "center",
                    borderRadius: "21px",
                    "& .MuiOutlinedInput-input": {
                      padding: "10px",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "400",
                      borderRadius: "21px",
                      border: "none",
                      background: selected?.background,
                    },
                  }}
                  renderValue={(selected) => {
                    if (selectedStatus === "") {
                      return <em>Select an option</em>;
                    }
                    return selectedStatus ? selectedStatus : "";
                  }}
                  onChange={(e) => handleUpdateStatus(row, e.target.value)}
                >
                  {menuOptions
                    .filter((option) => option !== selectedStatus) // Filter out the selected value
                    .map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </MDBox>
        );
      },
    },
    {
      Header: "Action",
      Align: "right",
      width: "15%",
      Cell: ({ value, row }) => {
        return (
          <MDBox
            sx={{
              display: "flex",
            }}
          >
            <IconButton
              onClick={() => handleAction(row.original.id, "navigate")}
              sx={{ visibility: row.original.status !== "PUBLISHED" ? "collapse" : "" }}
            >
              <img width={36} height={36} alt="navigate" src={DownloadIcon} />
            </IconButton>
            <IconButton
              onClick={() => handleAction(row.original.id, "view")}
              sx={{
                visibility: !["PUBLISHED", "SCHEDULED"].includes(row.original.status)
                  ? "collapse"
                  : "",
              }}
            >
              <img width={36} height={36} alt="navigate" src={ViewIcon} />
            </IconButton>
            <IconButton onClick={() => handleAction(row.original.id, "edit")}>
              <img width={36} height={36} alt="navigate" src={NavigateIcon} />
            </IconButton>
          </MDBox>
        );
      },
    },
  ];

  return columns;
};

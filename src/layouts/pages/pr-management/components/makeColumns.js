/* eslint-disable react/prop-types */
import { TableCell as MuiTableCell, IconButton } from "@mui/material";
import MDTypography from "components/MDTypography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import dayjs from "dayjs";
import FormControl from "@mui/material/FormControl";
import DownloadIcon from "assets/images/icons/downloadIcon.svg";
import ViewIcon from "assets/images/icons/viewIcon.svg";
import NavigateIcon from "assets/images/icons/navigateIcon.svg";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { truncateString } from "utils/helpers";

const statusOptions = [
  {
    value: "DRAFT",
    label: "Draft",
    background: `linear-gradient(0deg, #F8F8FC, #F8F8FC),linear-gradient(180deg, #439DEE 0%, #1E78E9 100%),linear-gradient(0deg, #000000, #000000)`,
  },
  {
    value: "SUBMITTED",
    label: "Submitted",
    background: `linear-gradient(0deg, #F8F8FC, #F8F8FC),
    linear-gradient(180deg, #439DEE 0%, #1E78E9 100%),
    linear-gradient(0deg, #747474, #747474),
    linear-gradient(0deg, #01B7F3, #01B7F3)`,
  },
  {
    value: "REVIEW",
    label: "Review",
    background: `linear-gradient(0deg, #F8F8FC, #F8F8FC),
    linear-gradient(180deg, #439DEE 0%, #1E78E9 100%),
    linear-gradient(0deg, #747474, #747474)`,
  },
  {
    value: "AWAITING_APPROVAL",
    label: "Awaiting Approval",
    background: `linear-gradient(0deg, #F8F8FC, #F8F8FC),
    linear-gradient(180deg, #439DEE 0%, #1E78E9 100%)`,
  },
  {
    value: "SCHEDULED",
    label: "Scheduled",
    background: `linear-gradient(0deg, #F8F8FC, #F8F8FC),
  linear-gradient(180deg, #439DEE 0%, #1E78E9 100%),
  linear-gradient(0deg, #747474, #747474),
  linear-gradient(0deg, #FF9900, #FF9900)`,
  },
  {
    value: "REJECTED",
    label: "Rejected",
    background: `linear-gradient(0deg, #F8F8FC, #F8F8FC),
    linear-gradient(180deg, #439DEE 0%, #1E78E9 100%),
    linear-gradient(0deg, #FF4D53, #FF4D53)`,
  },
  {
    value: "PUBLISHED",
    label: "Published",
    background: `linear-gradient(0deg, #000000, #000000),linear-gradient(0deg, #47BC4C, #47BC4C)`,
  },
];

export const makeColumns = (onSelect) => {
  const columns = [
    {
      Header: "PR ID",
      accessor: "prId",
      width: "10%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {value}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Title",
      accessor: "title",
      width: "18%",
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
      Cell: ({ value }) => {
        console.log("value", value);
        return (
          <MDBox sx={{ display: "flex", alignItems: "center" }}>
            <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
              {truncateString(value, 15)}
            </MDTypography>
            <MDBox
              alignItems="center"
              ml={1}
              justifyContent="center"
              sx={{ height: "24px", width: "22px", display: "flex" }}
              bgColor="#FFDBDD"
              borderRadius={4}
            >
              <FilterListOutlinedIcon />
            </MDBox>
          </MDBox>
        );
      },
    },
    {
      Header: "Publication /Bundles",
      accessor: "bundleInfo",
      width: "5%",
      Cell: ({ value, row }) => {
        const info = `${row.original.publicationIds.length}/${row.original.bundleInfo.length}`;
        return (
          <MDBox>
            <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
              {info}
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
      width: "12%",
      accessor: "status",
      Cell: ({ value }) => {
        const selectedStatus = value;
        console.log("selectedStatus", selectedStatus);
        const selected = statusOptions.find(
          (el) => selectedStatus === el?.value,
        );
        console.log("selected", selected);
        return (
          <MDBox>
            {["DRAFT", "AWAITING_APPROVAL", "PUBLISHED", "REJECTED"].includes(
              selectedStatus,
            ) ? (
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
              <FormControl sx={{ minWidth: 90 }} size="medium">
                <Select
                  id="demo-select-small"
                  value={selectedStatus}
                  sx={{
                    backgroundImage: selected?.background,
                    color: "white",
                    textAlign: "center",
                  }}
                  onChange={(e) => onSelect(e.target.value)}
                >
                  {selectedStatus === "SCHEDULED" ? (
                    <>
                      <MenuItem value={"SCHEDULED"}>SCHEDULED</MenuItem>
                      <MenuItem value={"REJECTED"}>REJECTED</MenuItem>
                      <MenuItem value={"PUBLISHED"}>PUBLISHED</MenuItem>
                    </>
                  ) : selectedStatus === "SUBMITTED" ? (
                    <>
                      <MenuItem value={"SUBMITTED"}>SUBMITTED</MenuItem>
                      <MenuItem value={"AWAITING_APPROVAL"}>
                        AWAITING_APPROVAL
                      </MenuItem>
                      <MenuItem value={"SCHEDULED"}>SCHEDULED</MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem value={"REVIEW"}>REVIEW</MenuItem>
                      <MenuItem value={"AWAITING_APPROVAL"}>
                        AWAITING_APPROVAL
                      </MenuItem>
                      <MenuItem value={"SCHEDULED"}>SCHEDULED</MenuItem>
                    </>
                  )}
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
      Cell: ({ value }) => {
        return (
          <MDBox
            sx={{
              display: "flex",
            }}
          >
            <>
              <IconButton>
                <img width={36} height={36} alt="navigate" src={DownloadIcon} />
              </IconButton>
              <IconButton>
                <img width={36} height={36} alt="navigate" src={ViewIcon} />
              </IconButton>
              <IconButton>
                <img width={36} height={36} alt="navigate" src={NavigateIcon} />
              </IconButton>
            </>
          </MDBox>
        );
      },
    },
  ];

  return columns;
};

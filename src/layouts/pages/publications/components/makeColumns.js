/* eslint-disable react/prop-types */
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "assets/images/icons/deleteIcon.svg";
import EditIcon from "assets/images/icons/editIcon.svg";
import ViewIcon from "assets/images/icons/viewIcon.svg";
import RowAction from "components/RowAction";
import DisplayImage from "components/DisplayImage";
import { visibilityOptions } from "../../../../constants";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { formatInr } from "./pricing";

const text = { fontSize: "14px", fontWeight: "400" };
const dash = (v) => (v === null || v === undefined || v === "" ? "-" : v);

// Logo, or the site's initials when it has none (imported sites usually don't)
const Logo = ({ src, name }) => {
  const initials = String(name || "?")
    .replace(/^www\./, "")
    .slice(0, 2)
    .toUpperCase();
  return src ? (
    <DisplayImage
      src={src}
      height="36px"
      width="36px"
      alt=""
      styles={{ objectFit: "contain", borderRadius: 6, background: "#fff" }}
    />
  ) : (
    <MDBox
      width="36px"
      height="36px"
      borderRadius="6px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: "#EE5C6114", color: "#F9565C", fontSize: "12px", fontWeight: 600 }}
    >
      {initials}
    </MDBox>
  );
};

export const makeColumns = (handleAction, handleUpdateStatus, settings) => {
  const columns = [
    {
      // Logo sits in the website cell so the table fits next to the sticky actions
      Header: "Website / offering",
      accessor: "domain",
      align: "left",
      Cell: ({ value, row }) => {
        const p = row.original;
        return (
          <MDBox display="flex" alignItems="center" gap={1.25}>
            <MDBox flexShrink={0}>
              <Logo src={p.image} name={value || p.title} />
            </MDBox>
            <MDBox minWidth="130px" maxWidth="200px">
              <Tooltip title={p.title || ""} placement="top-start">
                <MDTypography sx={{ fontSize: "14px", fontWeight: "600" }} noWrap>
                  {value || p.title}
                </MDTypography>
              </Tooltip>
              <MDTypography sx={{ fontSize: "12px", color: "#606F7B" }} noWrap>
                {p.variantLabel || (value ? "Standard article" : "Legacy (no domain)")}
              </MDTypography>
            </MDBox>
          </MDBox>
        );
      },
    },
    {
      Header: "Language",
      accessor: "language",
      Cell: ({ value }) => <MDTypography sx={text}>{dash(value)}</MDTypography>,
    },
    {
      Header: "Link",
      accessor: "linkType",
      Cell: ({ value }) => (
        <MDTypography sx={{ ...text, whiteSpace: "nowrap" }}>
          {value === "DO_FOLLOW" ? "Do-follow" : value === "NO_FOLLOW" ? "No-follow" : "-"}
        </MDTypography>
      ),
    },
    {
      Header: "TAT",
      accessor: "tat",
      Cell: ({ value }) => (
        <MDTypography sx={{ ...text, whiteSpace: "nowrap" }}>{dash(value)}</MDTypography>
      ),
    },
    {
      Header: "DA",
      accessor: "stats.da",
      Cell: ({ value }) => <MDTypography sx={text}>{value ? value : "-"}</MDTypography>,
    },
    {
      Header: "Credits",
      accessor: "price",
      Cell: ({ value }) => (
        <MDTypography sx={text}>
          <strong>{value}</strong>
        </MDTypography>
      ),
    },
    {
      Header: () => <span style={{ whiteSpace: "nowrap" }}>Vendor ₹</span>,
      accessor: "vendorPriceInr",
      Cell: ({ value }) => (
        <MDTypography sx={{ ...text, whiteSpace: "nowrap" }}>
          {value == null ? "-" : formatInr(value)}
        </MDTypography>
      ),
    },
    {
      Header: "Markup",
      accessor: "markupPercent",
      Cell: ({ value, row }) => {
        const vendorPriced = row.original.vendorPriceInr != null;
        return (
          <MDTypography sx={{ ...text, whiteSpace: "nowrap" }}>
            {value != null ? (
              <strong>{value}%</strong>
            ) : vendorPriced ? (
              <span style={{ color: "#606F7B" }}>
                default{settings ? ` (${settings.markupPercent}%)` : ""}
              </span>
            ) : (
              "-"
            )}
          </MDTypography>
        );
      },
    },
    {
      Header: "Visibility",
      accessor: "visibility",
      Cell: ({ value, row }) => {
        const selectedStatus = value;
        const selected = visibilityOptions.find((el) => selectedStatus === el?.value);

        return (
          <FormControl sx={{ width: "112px" }} size="medium">
            <Select
              id={`status-select-${row?.original?.id ?? row?.id}`}
              inputProps={{
                "aria-label": `Visibility of ${row.original.domain || row.original.title}`,
              }}
              displayEmpty
              value={selectedStatus}
              sx={{
                boxShadow: "none",
                textAlign: "center",
                borderRadius: "21px",
                height: "35px",
                color: "#fff",
                background: selected?.background,
                textTransform: "uppercase",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
                "& .MuiOutlinedInput-input": {
                  padding: "10px",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "400",
                  borderRadius: "21px",
                  border: "none",
                  boxShadow: "none",
                  "&.Mui-focused, &.Mui-focusVisible": {
                    outline: "none",
                    boxShadow: "none",
                  },
                },
              }}
              renderValue={() => (selectedStatus ? selectedStatus : <em>Select an option</em>)}
              onChange={(e) => handleUpdateStatus(row, e.target.value)}
            >
              {/* every option stays in the list: MUI warns when the value has no option */}
              {visibilityOptions.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      },
    },
    {
      Header: "Action",
      align: "right",
      sticky: true,
      Cell: ({ row }) => (
        <MDBox sx={{ display: "flex" }}>
          <RowAction
            label="View"
            icon={ViewIcon}
            onClick={() => handleAction(row.original.id, "view")}
          />
          <RowAction
            label="Edit"
            icon={EditIcon}
            onClick={() => handleAction(row.original.id, "edit")}
          />
          <RowAction
            label="Delete"
            icon={DeleteIcon}
            onClick={() => handleAction(row.original.id, "delete")}
          />
        </MDBox>
      ),
    },
  ];

  return columns;
};

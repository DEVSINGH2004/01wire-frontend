/* eslint-disable react/prop-types */
import { TableCell as MuiTableCell, IconButton, OutlinedInput } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { truncateString } from "utils/helpers";
import DeleteIcon from "assets/images/icons/deleteIcon.svg";
import EditIcon from "assets/images/icons/editIcon.svg";
import { visibilityOptions } from "../../../../constants";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export const makeColumns = (handleAction, handleUpdateStatus) => {
  const columns = [
    {
      Header: "Category",
      accessor: "category",
      width: "25%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {truncateString(value, 25)}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Type",
      accessor: "type",
      width: "25%",
      Cell: ({ value }) => (
        <MDBox
          px={1}
          borderRadius="21px"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#EBEBEB",
            width: "122px",
            height: "25px",
          }}
        >
          <MDTypography
            sx={{
              fontSize: "12px",
              fontWeight: "400",
            }}
          >
            {value}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Traffic",
      accessor: "traffic",
      width: "25%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "500" }}>
            {value ? `${value} Reach` : "-"}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Publications",
      accessor: "publicationInfo",
      width: "15%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "500" }}>{value?.length}</MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Visibility",
      width: "12%",
      accessor: "visibility",
      Cell: ({ value, row }) => {
        const selectedStatus = value;
        const selected = visibilityOptions.find((el) => selectedStatus === el?.value);

        return (
          <FormControl sx={{ width: "152px", height: "22px" }} size="medium">
            <Select
              input={<OutlinedInput sx={{ color: "white" }} />}
              id="demo-select-small"
              displayEmpty
              value={selectedStatus}
              sx={{
                boxShadow: "none",
                textAlign: "center",
                borderRadius: "21px",

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent", // Remove hover border color
                },

                "& .MuiOutlinedInput-input": {
                  padding: "10px",
                  color: "#fff",
                  fontSize: "12px",

                  fontWeight: "400",
                  borderRadius: "21px",
                  border: "none",
                  background: selected?.background,
                  "&.Mui-focused, &.Mui-focusVisible": {
                    outline: "none", // Remove the default focus outline
                    boxShadow: "none", // Remove the shadow which causes the blue outline
                  },
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
              {visibilityOptions
                .filter((option) => option.value !== "PRIVATE") // Filter out the selected value
                .map((option) => (
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
      Header: "Credits",
      accessor: "price",
      width: "10%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            <strong>{value}</strong>
          </MDTypography>
        </MDBox>
      ),
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
            <>
              <IconButton onClick={() => handleAction(row.original.id, "edit")}>
                <img width={36} height={36} alt="navigate" src={EditIcon} />
              </IconButton>
              <IconButton onClick={() => handleAction(row.original.id, "delete")}>
                <img width={36} height={36} alt="navigate" src={DeleteIcon} />
              </IconButton>
            </>
          </MDBox>
        );
      },
    },
  ];

  return columns;
};

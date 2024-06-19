/* eslint-disable react/prop-types */
import { TableCell as MuiTableCell, IconButton } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { truncateString } from "utils/helpers";
import DeleteIcon from "assets/images/icons/deleteIcon.svg";
import EditIcon from "assets/images/icons/editIcon.svg";
import { visibilityOptions } from "../../../../constants";

export const makeColumns = () => {
  const columns = [
    {
      Header: "Title",
      accessor: "title",
      width: "20%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {truncateString(value, 25)}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Traffic",
      accessor: "traffic",
      width: "10%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            <strong>{value}</strong>Reach
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Website",
      accessor: "url",
      width: "15%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "500" }}>
            {truncateString(value, 25)}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Link Type",
      accessor: "linkType",
      width: "15%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {value === "DO_FOLLOW" ? "Do Follow" : "No Follow"}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Publications",
      accessor: "categories",
      width: "15%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "500" }}>{value?.length}</MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Price",
      accessor: "price",
      width: "10%",
      Cell: ({ value }) => (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            <strong>{value}</strong>Credits
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Visibility",
      width: "12%",
      accessor: "visibility",
      Cell: ({ value }) => {
        const selectedStatus = value;
        const selected = visibilityOptions.find((el) => selectedStatus === el?.value);

        return (
          <MDBox
            px={1}
            borderRadius="21px"
            bgColor={selected?.background}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: selected?.background,
              color: "white",
              width: "122px",
              height: "25px",
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
                <img width={36} height={36} alt="navigate" src={EditIcon} />
              </IconButton>
              <IconButton>
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

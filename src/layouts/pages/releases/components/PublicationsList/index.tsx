import { useState, useEffect } from "react";
import DataTable from "layouts/pages/pr-management/components/DataTable";
import MDBox from "components/MDBox";
import MDAvatar from "components/MDAvatar";
import MDTypography from "components/MDTypography";
import { truncateString } from "utils/helpers";

const columns = [
  {
    Header: "Title",
    accessor: "logo",
    width: "10%",
    Cell: ({ value }: { value: "string" }) => (
      <MDBox mr={2}>
        <MDAvatar
          src={`${process.env.REACT_APP_IMAGE_BASE_URL}${value}`}
          variant="rounded"
          size="xxl"
          sx={{
            borderRadius: "4px",
          }}
        />
      </MDBox>
    ),
  },
  {
    Header: "",
    accessor: "title",
    width: "18%",
    Cell: ({ value }: { value: any }) => (
      <MDBox>
        <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
          {truncateString(value, 15)}
        </MDTypography>
      </MDBox>
    ),
  },
  {
    Header: "Blacklisted Categories",
    accessor: "categories",
    width: "20%",
    Cell: ({ value }: { value: any }) => {
      console.log("value", value);
      return (
        <MDBox>
          <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {truncateString(value, 15)}
          </MDTypography>
        </MDBox>
      );
    },
  },
  {
    Header: "Traffic",
    accessor: "trafic",
    width: "5%",
    Cell: ({ value }: { value: any }) => {
      return <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>{value}</MDTypography>;
    },
  },

  {
    Header: "PA",
    width: "10%",
    accessor: "pa",
    Cell: ({ value }: { value: any }) => {
      return <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>{value}</MDTypography>;
    },
  },
  {
    Header: "DA",
    width: "10%",
    accessor: "da",
    Cell: ({ value }: { value: any }) => {
      return <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>{value}</MDTypography>;
    },
  },
  {
    Header: "UR",
    width: "10%",
    accessor: "ur",
    Cell: ({ value }: { value: any }) => {
      return <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>{value}</MDTypography>;
    },
  },
  {
    Header: "DR",
    width: "10%",
    accessor: "dr",
    Cell: ({ value }: { value: any }) => {
      return <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>{value}</MDTypography>;
    },
  },
  {
    Header: "Link Type",
    width: "10%",
    accessor: "linkType",
    Cell: ({ value }: { value: any }) => {
      return <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>{value}</MDTypography>;
    },
  },
  {
    Header: "Credits",
    width: "10%",
    accessor: "credits",
    Cell: ({ value }: { value: any }) => {
      return <MDTypography sx={{ fontSize: "14px", fontWeight: "400" }}>{value}</MDTypography>;
    },
  },
];
const PublicationsList = ({ publications }: { publications: any }) => {
  console.log("publications", publications);
  const [tableData, setData] = useState<any>({ rows: [], columns: [] });
  useEffect(() => {
    let rows: any = [];
    if (publications?.length) {
      rows = publications?.map((one: any) => {
        const { pa, da, dr, ur } = one?.stats || {};
        return {
          logo: one?.image,
          title: one?.title,
          categories: one?.categories?.join("/"),
          traffic: one?.stats?.traffic,
          pa,
          da,
          ur,
          dr,
          linkType: one?.linkType,
          credits: one?.price,
        };
      });
      setData({ rows, columns });
    }
  }, [publications]);
  return (
    <>
      <DataTable canSearch table={tableData} showHeader />
    </>
  );
};
export default PublicationsList;

import { useState, useEffect } from "react";
import DataTable from "layouts/pages/pr-management/components/DataTable";
import MDBox from "components/MDBox";
import MDAvatar from "components/MDAvatar";
import MDTypography from "components/MDTypography";
import { truncateString } from "utils/helpers";
import MDCircularLoader from "components/MDCircularLoader";

const PublicationsList = ({
  publications,
  updatePage,
  paginationInfo,
  onSelect,
  selectedP,
  loading,
  disabled = false,
}: {
  publications: any;
  updatePage: any;
  paginationInfo: any;
  onSelect?: any;
  selectedP: any;
  loading: boolean;
  disabled: boolean;
}) => {
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
            size="lg"
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
      width: "20%",
      Cell: ({ value }: { value: any }) => (
        <MDBox>
          <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
            {truncateString(value, 15)}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      Header: "Blacklisted Categories",
      accessor: "categories",
      width: "30%",
      Cell: ({ value }: { value: any }) => {
        return (
          <MDBox>
            <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
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
        return (
          <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
            {value}
          </MDTypography>
        );
      },
    },

    {
      Header: "PA",
      width: "5%",
      accessor: "pa",
      Cell: ({ value }: { value: any }) => {
        return (
          <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
            {value}
          </MDTypography>
        );
      },
    },
    {
      Header: "DA",
      width: "5%",
      accessor: "da",
      Cell: ({ value }: { value: any }) => {
        return (
          <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
            {value}
          </MDTypography>
        );
      },
    },
    {
      Header: "UR",
      width: "5%",
      accessor: "ur",
      Cell: ({ value }: { value: any }) => {
        return (
          <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
            {value}
          </MDTypography>
        );
      },
    },
    {
      Header: "DR",
      width: "5%",
      accessor: "dr",
      Cell: ({ value }: { value: any }) => {
        return (
          <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
            {value}
          </MDTypography>
        );
      },
    },
    {
      Header: "Link Type",
      width: "10%",
      accessor: "linkType",
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
          <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
            {value}
          </MDTypography>
        );
      },
    },
  ];
  const [tableData, setData] = useState<any>({ rows: [], columns: [] });
  useEffect(() => {
    let rows: any = [];
    if (publications?.length) {
      rows = publications?.map((one: any) => {
        const { pa, da, dr, ur } = one?.stats || {};
        return {
          id: one?.id,
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
  const handlePagination = (page: number) => {
    updatePage(page - 1);
  };

  return (
    <MDBox sx={{ minHeight: "100px" }}>
      {loading ? (
        <MDCircularLoader startLoader />
      ) : publications?.length > 0 ? (
        <DataTable
          canSearch
          table={tableData}
          showHeader
          paginationInfo={!disabled && paginationInfo}
          handlePagination={!disabled && handlePagination}
          onSelectedRowsChange={onSelect}
          defaultSelectedRows={selectedP}
        />
      ) : (
        <MDBox sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MDTypography variant="h6">No publications found</MDTypography>
        </MDBox>
      )}
    </MDBox>
  );
};
export default PublicationsList;

import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useRef } from "react";
import { AppBar, Toolbar, useScrollTrigger } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import OneWireLogo from "assets/images/OneWireLogo_2.svg";
import {
  GET_ARTICLE_BY_ID,
  IGetArticleById,
  IGetArticleByIdVars,
} from "graphql/queries/getArticleById";
import DisplayImage from "components/DisplayImage";
import Link from "@mui/material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import DataTable from "layouts/pages/pr-management/components/DataTable";
const columns = [
  {
    Header: "Category",
    accessor: "category",
    width: "25%",
    align: "left",
    Cell: ({ value }: { value: "string" }) => (
      <MDTypography fontWeight="medium" sx={{ fontSize: "16px", fontFamily: "Roboto" }}>
        {value}
      </MDTypography>
    ),
  },
  {
    Header: "Type",
    accessor: "type",
    width: "25%",
    Cell: ({ value }: { value: any }) => (
      <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
        {value}
      </MDTypography>
    ),
  },
  {
    Header: "Traffic",
    accessor: "traffic",
    width: "25%",
    Cell: ({ value }: { value: any }) => {
      return (
        <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
          {value}
        </MDTypography>
      );
    },
  },
  {
    Header: "Publications",
    accessor: "publicationIds",
    width: "25%",
    align: "right",
    Cell: ({ value }: { value: any }) => {
      return (
        <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
          {value?.length}
        </MDTypography>
      );
    },
  },
];
const columnsPub = [
  {
    Header: "Title",
    accessor: "title",
    width: "25%",
    align: "left",
    Cell: ({ value }: { value: "string" }) => (
      <MDTypography fontWeight="medium" sx={{ fontSize: "16px", fontFamily: "Roboto" }}>
        {value}
      </MDTypography>
    ),
  },
  {
    Header: "Traffic",
    accessor: "stats",
    width: "25%",
    Cell: ({ value }: { value: any }) => {
      return (
        <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
          {value?.traffic || "-"}
        </MDTypography>
      );
    },
  },
  {
    Header: "Website",
    accessor: "url",
    width: "25%",
    align: "center",
    Cell: ({ value = "-" }: { value: any }) => {
      return (
        <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
          {value}
        </MDTypography>
      );
    },
  },
  {
    Header: "LinkType",
    accessor: "linkType",
    width: "25%",
    align: "right",
    Cell: ({ value }: { value: any }) => (
      <MDTypography fontWeight="regular" sx={{ fontSize: "14px", fontFamily: "Roboto" }}>
        {value.split("_").join(" ")}
      </MDTypography>
    ),
  },
];
const ShareReleases = () => {
  const { id } = useParams();
  const { data, loading } = useQuery<IGetArticleById, IGetArticleByIdVars>(GET_ARTICLE_BY_ID, {
    fetchPolicy: "network-only",
    variables: {
      id,
    },
  });

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  const {
    title = "-",
    featureImage = "",
    mediaContact = {},
    content = "",
  }: any = data?.getArticleById || {};

  const textRef = useRef<HTMLDivElement>(null);

  const handleCopied = () => {
    if (textRef.current) {
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        selection.removeAllRanges();
        toast.success("Copied to clipboard");
      }
    }
  };
  const bundleRows = data?.getArticleById?.bundleInfo;
  const rows: any = data?.getArticleById?.publicationInfo || [];

  return (
    <MDBox>
      <AppBar
        position="fixed"
        sx={{
          background: trigger ? "rgba(255, 255, 255, 0.8)" : "transparent",
          backdropFilter: trigger ? "blur(8px)" : "none",
          height: "116px",
          boxShadow: "0px 4px 24px 0px rgba(0, 0, 0, 0.06)",
          transition: "background 0.3s ease-out, backdrop-filter 0.3s ease-out",
        }}
      >
        <Toolbar sx={{ height: "100%" }}>
          <MDBox m="auto">
            <img src={OneWireLogo} height={"46px"} width="100%" />
          </MDBox>
        </Toolbar>
      </AppBar>
      <MDBox sx={{ minHeight: "400px", marginTop: "116px" }} ref={textRef}>
        {loading ? (
          <MDCircularLoader startLoader />
        ) : id ? (
          <>
            <MDBox sx={{ padding: "40px 180px" }}>
              <MDTypography fontSize="50px" color="black" fontWeight="bold">
                {title}
              </MDTypography>
              <MDBox sx={{ marginTop: "30px" }}>
                <DisplayImage
                  src={featureImage}
                  height="550px"
                  width="100%"
                  alt={"img"}
                  styles={{ borderRadius: "10px" }}
                />
              </MDBox>
              <MDTypography sx={{ marginTop: "40px", textAlign: "justify" }} fontSize="20px">
                {data?.getArticleById?.summary}
              </MDTypography>
              <MDTypography
                fontSize="35px"
                color="black"
                fontWeight="bold"
                sx={{ marginTop: "20px" }}
              >
                Introduction
              </MDTypography>

              <MDTypography sx={{ marginTop: "20px", textAlign: "justify" }} fontSize="20px">
                {content.replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, "")}
              </MDTypography>

              <MDBox
                sx={{
                  minHeight: "300px",
                  marginTop: "50px",
                  width: "100%",
                  boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
                  borderRadius: "10px",
                  textAlign: "center",
                  padding: "20px 0px",
                }}
                bgColor="white"
              >
                <MDTypography
                  fontSize="20px"
                  color="black"
                  fontWeight="bold"
                  sx={{ paddingBottom: "10px" }}
                >
                  Media Contact
                </MDTypography>
                <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                  Name : {mediaContact?.name}
                </MDTypography>
                <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                  Email : {mediaContact?.email}
                </MDTypography>
                <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                  Phone : {mediaContact?.phone}
                </MDTypography>
                <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                  Website : {mediaContact?.website}
                </MDTypography>
                <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                  Address : {mediaContact?.address}
                </MDTypography>

                <MDTypography
                  fontSize="20px"
                  color="black"
                  fontWeight="bold"
                  sx={{ padding: "30px 0px 10px 0px" }}
                >
                  Social Media
                </MDTypography>

                <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                  Facebook :{" "}
                  <Link
                    sx={{
                      cursor: "pointer",
                    }}
                    href={mediaContact?.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {mediaContact?.facebook}
                  </Link>
                </MDTypography>
                <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                  Instagram :{" "}
                  <Link
                    sx={{
                      cursor: "pointer",
                    }}
                    href={mediaContact?.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {mediaContact?.instagram}
                  </Link>
                </MDTypography>
              </MDBox>
              {data?.getArticleById?.bundleInfo.length > 0 && (
                <>
                  <MDTypography
                    fontSize="35px"
                    color="black"
                    fontWeight="bold"
                    sx={{ marginTop: "30px" }}
                  >
                    Bundles
                  </MDTypography>
                  {/* bundles table */}
                  <MDBox
                    sx={{
                      marginTop: "35px",
                      width: "100%",
                      boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                    bgColor="white"
                  >
                    <DataTable
                      canSearch
                      table={{ rows: bundleRows, columns }}
                      showHeader
                      entriesPerPage={false}
                      maxHeight={"400px"}
                    />
                  </MDBox>
                  {/* end bundles table */}
                </>
              )}
              {data?.getArticleById?.publicationInfo.length > 0 && (
                <>
                  <MDTypography
                    fontSize="35px"
                    color="black"
                    fontWeight="bold"
                    sx={{ marginTop: "30px" }}
                  >
                    Publication
                  </MDTypography>
                  {/* Publication table */}
                  <MDBox
                    sx={{
                      marginTop: "35px",
                      width: "100%",
                      boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                    bgColor="white"
                  >
                    <DataTable
                      canSearch
                      table={{ rows, columns: columnsPub }}
                      showHeader
                      entriesPerPage={false}
                      maxHeight={"400px"}
                    />
                  </MDBox>
                  {/* end Publication table */}
                </>
              )}
            </MDBox>
            <MDBox
              display="flex"
              justifyContent="flex-end"
              alignItem="center"
              sx={{ position: "sticky", bottom: 40 }}
            >
              <MDBox
                display="flex"
                justifyContent="center"
                bgColor="rgba(255, 255, 255, 0.8)"
                borderRadius="50%"
                shadow="rgba(0, 0, 0, 0.1) 0px 10px 50px"
                mr={3}
                pt={1.8}
                sx={{
                  width: "50px",
                  height: "50px",
                  cursor: "pointer",
                }}
                onClick={() => handleCopied()}
              >
                <ContentCopyIcon />
              </MDBox>
            </MDBox>
          </>
        ) : (
          <MDBox
            sx={{
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MDTypography variant="h6">No estimation found</MDTypography>
          </MDBox>
        )}
      </MDBox>
    </MDBox>
  );
};

export default ShareReleases;

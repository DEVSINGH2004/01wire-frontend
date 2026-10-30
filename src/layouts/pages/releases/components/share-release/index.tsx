import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useRef, useState } from "react";
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
import MDEditor from "components/MDEditor";
import Button from "@mui/material/Button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DownloadIcon from "@mui/icons-material/Download";

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
  const [loader, setLoader] = useState<boolean>(false);
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
  const { facebook, instagram, twitter, linkedIn, youtube } = mediaContact || {};
  const htmlRef = useRef<HTMLDivElement>(null);

  const handleCopied = async () => {
    if (htmlRef.current) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlRef.current.innerHTML;

      // Adjust image styles to prevent overflow and maintain aspect ratio
      const images = tempDiv.querySelectorAll("img");
      images.forEach((img) => {
        img.style.maxWidth = "100%";
        img.style.height = "auto";
      });

      // Embed styles directly into the copied content
      const styles = `
        <style>
          * {
            line-height: 1.5 !important;
          }
          img {
            max-width: 100% !important;
            height: auto !important;
          }
          h1, h2, h3, h4, h5, h6, p, span, div {
            font-family: Arial, sans-serif !important;
          }
          h1 {
            font-weight: bold !important;
          }
        </style>
      `;

      const html = styles + tempDiv.innerHTML;

      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
          }),
        ]);
        toast.success("Copied to clipboard");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };
  const downloadPdf = async () => {
    setLoader(true);
    const element = htmlRef.current;

    // Step 1: Convert the component to a canvas with a lower scale to reduce size
    const canvas = await html2canvas(element, {
      scale: 1.5, // Lower scale factor to reduce size, you can adjust as needed
      useCORS: true, // Handle CORS for external resources
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.75); // Lower the quality to 75%

    // Step 2: Prepare PDF options
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const ratio = pdfWidth / canvasWidth;
    const scaledHeight = canvasHeight * ratio;

    // Step 3: Split content into multiple pages
    let position = 0;
    while (position < scaledHeight) {
      if (position > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, "JPEG", 0, -position, pdfWidth, scaledHeight);

      position += pdfHeight;
    }
    // Step 4: Download the PDF
    pdf.save("download.pdf");
    setLoader(false);
  };

  const bundleRows = data?.getArticleById?.bundleInfo;
  const rows: any = data?.getArticleById?.publicationInfo || [];

  return (
    <MDBox position="relative">
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
          <MDBox sx={{ textAlign: "right" }}>
            <Button
              startIcon={<DownloadIcon fontSize="medium" />}
              sx={{
                color: "#000",
                background: "#fff",
                "&:hover": {
                  background: "#fff",
                },
              }}
              onClick={downloadPdf}
              variant="contained"
            >
              {loader ? "Downloading..." : "Download"}
            </Button>
          </MDBox>
        </Toolbar>
      </AppBar>

      <MDBox sx={{ minHeight: "400px", marginTop: "116px" }} ref={htmlRef}>
        {loading ? (
          <MDCircularLoader startLoader />
        ) : id ? (
          <>
            <MDBox sx={{ padding: "40px 180px" }}>
              <MDTypography color="black" variant="h2">
                {title}
              </MDTypography>
              <MDBox sx={{ marginTop: "30px" }}>
                <DisplayImage
                  src={featureImage}
                  height="auto"
                  width="100%"
                  alt={"img"}
                  styles={{ borderRadius: "10px" }}
                />
              </MDBox>
              {/* Sub-heading is optional */}
              {data?.getArticleById?.summary && (
                <MDTypography sx={{ marginTop: "40px", textAlign: "justify" }} fontSize="20px">
                  {data.getArticleById.summary}
                </MDTypography>
              )}
              <MDTypography
                fontSize="35px"
                color="black"
                fontWeight="bold"
                sx={{ marginTop: "20px" }}
              >
                Introduction
              </MDTypography>
              {data?.getArticleById?.content && (
                <MDEditor noBorder disabled onChange={() => {}} value={content} />
              )}
              {/* <MDTypography sx={{ marginTop: "20px", textAlign: "justify" }} fontSize="20px">
                <div className="press-release-text" dangerouslySetInnerHTML={{ __html: content }} />
              </MDTypography> */}
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
                {(facebook || instagram || twitter || youtube || linkedIn) && (
                  <>
                    <MDTypography
                      fontSize="20px"
                      color="black"
                      fontWeight="bold"
                      sx={{ padding: "30px 0px 10px 0px" }}
                    >
                      Social Media
                    </MDTypography>

                    {facebook && (
                      <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                        Facebook :{" "}
                        <Link
                          sx={{
                            cursor: "pointer",
                          }}
                          href={facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {facebook}
                        </Link>
                      </MDTypography>
                    )}
                    {instagram && (
                      <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                        Instagram :{" "}
                        <Link
                          sx={{
                            cursor: "pointer",
                          }}
                          href={instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {instagram}
                        </Link>
                      </MDTypography>
                    )}
                    {linkedIn && (
                      <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                        LinkedIn :{" "}
                        <Link
                          sx={{
                            cursor: "pointer",
                          }}
                          href={linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {linkedIn}
                        </Link>
                      </MDTypography>
                    )}
                    {twitter && (
                      <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                        Twitter :{" "}
                        <Link
                          sx={{
                            cursor: "pointer",
                          }}
                          href={twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {twitter}
                        </Link>
                      </MDTypography>
                    )}
                    {youtube && (
                      <MDTypography fontSize="17px" sx={{ lineHeight: 1.3 }}>
                        Youtube :{" "}
                        <Link
                          sx={{
                            cursor: "pointer",
                          }}
                          href={youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {youtube}
                        </Link>
                      </MDTypography>
                    )}
                  </>
                )}
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
                    Publications
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
            <MDTypography variant="h6">No release found</MDTypography>
          </MDBox>
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
          onClick={handleCopied}
        >
          <ContentCopyIcon />
        </MDBox>
      </MDBox>
    </MDBox>
  );
};

export default ShareReleases;

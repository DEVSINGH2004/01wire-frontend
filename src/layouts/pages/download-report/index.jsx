import React, { useRef, useState, useEffect } from "react";
import "./download.css";
import Box from "@mui/material/Box";
import OneWireLogo from "assets/images/OneWireLogo_2.svg";
import DownloadBg from "assets/images/download-report/downloadBg.png";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import MDTypography from "components/MDTypography";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { renderToString } from "react-dom/server";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useQuery } from "@apollo/client";
import { Divider } from "@mui/material";
import {
  GET_ARTICLE_BY_ID
} from "graphql/queries/getArticleById";
import { useLocation } from "react-router-dom";
import { GET_ORDERS } from "graphql/queries/filterOrdersPaginated";
import Link from "@mui/material/Link";

const SocialMediaLink = ({ IconComponent, platform, bgColor, to }) => (
  <Link
    sx={{
      cursor: "pointer",
    }}
    href={to}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Box className="social-media-link" sx={{ background: bgColor, cursor: 'pointer' }}>
      <IconComponent sx={{ fontSize: 40 }} />
      <Box className="platform-name" >{platform}</Box>
    </Box>
  </Link>
);

const CompanyInfoItem = ({ label, value }) => (
  <>
    <Box className="info-label">{label}</Box>
    <Box className="info-value">{value}</Box>
  </>
);

const PickupSection = ({ platform, logo, buttonText }) => (
  <section className="pickup-section">
    <h3 className="pickup-title">{platform} Pickup</h3>
    <img
      loading="lazy"
      src={logo}
      alt={`${platform} logo`}
      className="platform-logo"
    />
    <Box className="view-release-button">
      <span className="button-text">{buttonText}</span>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ebc27a61073d501c465349a712468f26af54b99226b48048cfc1b3d4cf1ab0a?apiKey=a76d01df06f64f7f8c0e5d6a100e4150&"
        alt="Arrow icon"
        className="arrow-icon"
      />
    </Box>
  </section>
);

const DistributionItem = ({
  logo,
  name,
  link,
  type,
  industry,
  countries,
  audience,
}) => (
  <Box className="distribution-item">
    <img
      loading="lazy"
      src={logo}
      alt={`${name} logo`}
      className="distribution-logo"
    />
    <a href={link} className="distribution-link">
      View Release
    </a>
    <span className="distribution-type">{type}</span>
    <span className="distribution-industry">{industry}</span>
    <span className="distribution-countries">{countries}</span>
    <span className="distribution-audience">{audience} visit/month</span>
  </Box>
);

const getId = () => {
  return new URLSearchParams(useLocation().search);
};
function PressReleaseReport() {
  const query = getId();
  const id = query.get('id');
  const componentRef = useRef();
  const handleDownloadPDF = async () => {
    const element = componentRef.current;

    // Step 1: Convert the component to a canvas with a lower scale to reduce size
    const canvas = await html2canvas(element, {
      scale: 1.5, // Lower scale factor to reduce size, you can adjust as needed
      useCORS: true, // Handle CORS for external resources
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.75); // Lower the quality to 75%

    // Step 2: Prepare PDF options
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
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

      pdf.addImage(
        imgData,
        'JPEG',
        0,
        -position,
        pdfWidth,
        scaledHeight
      );

      position += pdfHeight;
    }

    // Step 4: Download the PDF
    pdf.save('download.pdf');
  };
  const { data } = useQuery(GET_ARTICLE_BY_ID, {
    fetchPolicy: "network-only",
    variables: {
      id,
    },
  });

  const { data: orderData } = useQuery(GET_ORDERS, {
    fetchPolicy: "network-only",
    variables: {
      paginationInput: {
        perPage: 200,
        currentPage: 0,
      },
      filterInput: {
        articleId: id,
      },
    },
  });
  return (
    <>
      <Button
        color="primary"
        variant="conatined"
        sx={{
          position: "absolute",
          top: "10px",
          right: "200px",
        }}
        onClick={handleDownloadPDF}
      >
        Download Report
      </Button>
      <Box margin="auto" ref={componentRef} style={{ padding: 20, width: '210mm' /* A4 width */ }}>
        <header
          style={{
            backgroundColor: " #fff",
            // margin: "0 145px",
          }}
        >
          <Box className="logo-container">
            <img
              loading="lazy"
              src={DownloadBg}
              alt="Company logo"
              className="company-logo"
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "absolute",
              }}
            >
              <img
                loading="lazy"
                src={OneWireLogo}
                alt="Wire logo"
                height={75}
                width={168}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: "48px",
            }}
          >
            <Box height={95} width={5} backgroundColor={"#FF4D53"} mr={1}></Box>
            <Typography
              sx={{
                fontSize: "48px",
                fontWeight: "700",
                lineHeight: "59.34px",
              }}
            >
              Press Release <br /> Distribution Report
            </Typography>
          </Box>
          <Box mx="48px">
            <Typography sx={{ mt: 1 }} className="section-title">
              COMPANY ADDRESS
            </Typography>
            <Box
              sx={{
                borderRadius: "6px",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9fd",
                padding: "17px 27px",
                marginBottom: "28px",
              }}
            >
              <Box className="info-grid">
                <Box className="info-column">
                  <CompanyInfoItem
                    label="Company Name"
                    value={data?.getArticleById?.clientInfo?.title}
                  />
                  <CompanyInfoItem label="Phone" value="+91 9999 44 0531" />
                  <CompanyInfoItem
                    label="Email"
                    value={data?.getArticleById?.clientInfo?.email}
                  />
                </Box>
                <Box className="info-column">
                  <CompanyInfoItem label="Country" value="United Kingdom" />
                  <CompanyInfoItem label="Website" value={data?.getArticleById?.clientInfo?.website} />
                </Box>
                <Box className="info-column">
                  <CompanyInfoItem
                    label="Address 1"
                    value="4th Floor , St John House, 2-10 Queen St"
                  />
                  <CompanyInfoItem label="City" value="Manchester M2 5JB" />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box mx="48px" mb="62px">
            <h3 className="section-title">Follow Us</h3>
            <Box
              sx={{
                justifyContent: "center",
                display: "flex",
                borderRadius: "6px",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9fd",
                padding: "17px 27px",
                marginBottom: "28px",
                gap: "10px",
              }}
            >
              <SocialMediaLink
                IconComponent={FacebookIcon}
                platform="Facebook"
                bgColor={"#0766FF"}
                to={data?.getArticleById?.clientInfo?.social?.facebook}
              />
              <SocialMediaLink
                IconComponent={XIcon}
                platform="x.com"
                bgColor={"#0B66C2"}
                to={data?.getArticleById?.clientInfo?.social?.linkedIn}
              />
              <SocialMediaLink
                IconComponent={InstagramIcon}
                platform="Instagram"
                bgColor={`linear-gradient(0deg, #D9D9D9, #D9D9D9),linear-gradient(0deg, #0766FF, #0766FF),linear-gradient(49.12deg, #FFDD55 6.62%, #FF543E 50.06%, #C837AB 93.5%)`}
                to={data?.getArticleById?.clientInfo?.social?.instagram}
              />
              <SocialMediaLink
                IconComponent={LinkedInIcon}
                platform="Linkedin"
                bgColor={"#0B66C2"}
                to={data?.getArticleById?.clientInfo?.social?.linkedIn}
              />
            </Box>
          </Box>
          <footer
            style={{
              mx: "48px",
            }}
          >
            <Divider width="100%" />
            <Box
              mx="48px"
              mb={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>One Wire</Typography>
              <Typography>www.onewire.com</Typography>
            </Box>
          </footer>
        </header>
        <main className="report-content" style={{ breakBefore: "page" }}>
          <section className="press-release-summary" >
            <Typography
              sx={{
                fontSize: "26px",
                fontWeight: "700",
                lineHeight: "20px",
                mt: 1
              }}
            >
              Your Submitted Press Release
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "500",
                lineHeight: "20px",
                my: 2,
              }}
            >
              Avensure H&S & HR Outsourcing Services Rolls Out Care <br />{" "}
              Compliance Bureau
            </Typography>
            <Typography
              sx={{
                color: "rgba(0, 0, 0, 0.6)",
                font: "400 10px 'PP Neue Montreal', sans-serif",
              }}
            >
              Date Submitted: 2024-5-02
            </Typography>
            <Box className="metrics-container">
              <Box className="metric-item">
                <h4 className="metric-title">Recorded Full Page Placements*</h4>
                <p className="metric-value">12B</p>
              </Box>
              <Box className="metric-item">
                <h4 className="metric-title">Potential Audience Reach</h4>
                <p className="metric-value">3B</p>
              </Box>
            </Box>
          </section>
          <section className="pickup-sections">
            <Box className="pickup-row">
              <PickupSection
                platform="Onewire"
                logo="https://cdn.builder.io/api/v1/image/assets/TEMP/e7f21ac09c13d8881a4922c5357da66bc19fd7dc246f65ea59d19ee8d3ce7bae?apiKey=a76d01df06f64f7f8c0e5d6a100e4150&"
                buttonText="See your Release"
              />
              <PickupSection
                platform="Google"
                logo="https://cdn.builder.io/api/v1/image/assets/TEMP/5569583e18ff30a7239602306f9d64d163c05c639adc273adf8ed814d6ef64f4?apiKey=a76d01df06f64f7f8c0e5d6a100e4150&"
                buttonText="See your Release"
              />
            </Box>
            <Box className="pickup-row">
              <PickupSection
                platform="Yahoo"
                logo="https://cdn.builder.io/api/v1/image/assets/TEMP/e96085034d55e68776e0b9eadab871f1f28af86c7a1c53c84cd718879e69efcc?apiKey=a76d01df06f64f7f8c0e5d6a100e4150&"
                buttonText="See your Release"
              />
              <PickupSection
                platform="Bing"
                logo="https://cdn.builder.io/api/v1/image/assets/TEMP/f9b479ab979a16077b98bfddff3a67d1af968c7b0d2c380d98182bca585752c7?apiKey=a76d01df06f64f7f8c0e5d6a100e4150&"
                buttonText="See your Release"
              />
            </Box>
          </section>
          <footer
            style={{
              mx: "48px",
            }}
          >
            <Divider width="100%" />
            <Box
              mx="48px"
              mb={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>One Wire</Typography>
              <Typography>www.onewire.com</Typography>
            </Box>
          </footer>
        </main>
        <section className="press-release-content">
          <h2 className="section-title">Your Submitted Press Release</h2>
          <p className="press-release-text">
            Manchester M2 5JB, United Kingdom, 3rd May 2024, King NewsWire -
            Avensure H&S & HR Outsourcing Services has successfully launched the
            Care Compliance Bureau, a dedicated service for registered providers
            of Care Homes and Homecare (Adult Care in England). The company's
            impressive 2023 performance shows its persistent quest for
            excellence in outsourced HR services. As a result, the company was
            under consideration for Consultancy of the Year at the British HR
            Awards.
            <br />
            <br />
            Avensure H&S & HR Outsourcing Services entered the month of April
            2024, unveiling a brand new CCB website, which ensures care
            businesses and their workforce meet Care Quality Commission
            regulations, fundamental standards, and Quality Statements.
            <br />
            <br />
            "CCB's goal is to offer support with documentation and guidance on
            document usage within care services. It provides care businesses
            with a more robust and compliant foundation, particularly in light
            of the new single assessment framework," Chris Garner, Managing
            Director of Avensure, explained.
            <br />
            <br />
            As part of Avensure H&S & HR Outsourcing Services, CCB offers
            comprehensive support and an approach to compliance covering various
            operational aspects beyond CQC requirements. "CCB is your partner
            for CQC compliance in the era of new regulations," Garner stated.
          </p>
          <h3 className="subsection-title">British HR Awards Nomination</h3>
          <p className="press-release-text">
            Avensure H&S & HR Outsourcing Services were shortlisted for
            Consultancy of the Year along with over 25 entities at the
            prestigious British HR Awards.
            <br />
            <br />
            "It's fantastic to be shortlisted for Consultancy of the Year. The
            esteemed recognition reflects our commitment to delivering
            unparalleled HR solutions tailored to each client's unique needs. We
            are truly honoured to be acknowledged as part of HR excellence in
            the UK this year and look forward to the award ceremony on April
            16," Chris Garner remarked.
            <br />
            <br />
            The British HR Awards, powered by New Possible's employee insight
            platform, aims to discover and celebrate genuinely passionate
            organisations about delivering a world-class people experience.
            There were over 300 entries across categories from organisations in
            the UK.
          </p>
          <h3 className="subsection-title">The 2023 Record Year</h3>
          <p className="press-release-text">
            <a href="#" className="company-link">
              Avensure H&S & HR Outsourcing Services
            </a>{" "}
            reported 2023 as a record year, with a 30% revenue increase and £4
            million EBITDA.
            <br />
            <br />
            2023 was a record year for us, with new services offered to support
            clients and a major £1 million investment in new technology,
            launching the PeopleCloud platform," Chris Garner shared.
          </p>
          <footer className="content-footer">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/6b9fb197a1a148e5e92cf368ee7149d3b74867abbcb5f6ddc39b189c80e5c060?apiKey=a76d01df06f64f7f8c0e5d6a100e4150&"
              alt="Decorative line"
              className="decorative-line"
            />
            <Box className="footer-content">
              <Box className="footer-title">One Wire</Box>
              <Box className="footer-website">www.onewire.com</Box>
            </Box>
          </footer>
        </section>
        <section className="additional-content">
          <p className="press-release-text">
            The Avensure H&S & HR Outsourcing Services Managing Director
            attributed the company's improved financial success to its increased
            market attractiveness, led by its extensive product range. "It's
            becoming a 'no brainer' to use our services. They're affordable and
            easy to use with hands-on help and support, coupled with our
            next-generation online HR & H&S management system, making us the
            perfect match for UK businesses," Garner observed.
            <br />
            <br />
            The company also takes pride in its people. Garner expounded this,
            adding, "We deeply believe in the talents behind Avensure H&S & HR
            Outsourcing Services. Our unique, commercially driven support is
            delivered by experts who truly care about clients, each motivated to
            go the extra mile. This culture within Avensure H&S & HR Outsourcing
            Services is becoming well-known nationwide, giving us a market edge.
            We have thousands of 5-star reviews, which echo around the UK
            business environment and attract many new clients."
            <br />
            <br />
            Avensure H&S & HR Outsourcing Services accrues over 1,000 clients
            yearly and believes this needs to be supported. The company
            constantly invests in HR experts, health and safety specialists and
            great legal minds. Always looking to expand its product range and
            reinvest in its products, Avensure H&S & HR Outsourcing Services
            creates more recruitment opportunities, leading to roles being
            filled in its immigration and care compliance departments.
            <br />
            <br />
            "We're very fortunate our culture reverberates around the industry,"
            Garner commented. "Avensure has a lot of fantastic professionals
            wanting to join our organisation on an almost daily basis. We can
            handpick who we believe will benefit clients the most, thus
            reinforcing our mission of being the number 1 provider in the UK."
          </p>
          <h3 className="subsection-title">Scheduled Webinars</h3>
          <p className="press-release-text">
            Avensure H&S & HR Outsourcing Services is proud to lead the market
            by providing top-notch training and valuable information to improve
            employment law and health and safety practices.
            <br />
            <br />
            "Our strength lies in offering practical training and employment law
            insights tailored to impact businesses positively. We also have a
            profound understanding of UK businesses' current challenges. By
            pinpointing real-time trends and areas of concern, we deliver
            effective training solutions," Chris Garner said.
            <br />
            <br />
            Here are the previous and upcoming CPD-accredited Avensure H&S & HR
            Outsourcing Services Webinars for Q2:
            <br />
            <ul>
              <li>March 2024: HR - The Ultimate Guide to Annual Leave</li>
              <li>April 2024: Health and Safety Manual Handling</li>
              <li>June 2024: H&S Fire Risk Assessments</li>
            </ul>
            <br />
            Avensure H&S & HR Outsourcing Services stands out with over 5,000 UK
            businesses in its client portfolio, ranging from micro to SME
            clients, giving the company a unique advantage.
            <br />
            <br />
            <a href="https://www.avensure.com/" className="company-link">
              Visit https://www.avensure.com/ to learn more.
            </a>
          </p>
          <footer className="content-footer">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/6b9fb197a1a148e5e92cf368ee7149d3b74867abbcb5f6ddc39b189c80e5c060?apiKey=a76d01df06f64f7f8c0e5d6a100e4150&"
              alt="Decorative line"
              className="decorative-line"
            />
            <Box className="footer-content">
              <Box className="footer-title">One Wire</Box>
              <Box className="footer-website">www.onewire.com</Box>
            </Box>
          </footer>
        </section>
        <section className="distribution-list">
          {orderData?.filterOrdersPaginated?.data?.map((item, index) => (
            <DistributionItem
              key={index}
              logo={item?.publicationInfo?.image}
              name="Distribution Item"
              link={item?.publicationInfo?.url}
              type={item?.publicationInfo?.title}
              industry="Finance"
              countries="Global"
              audience={item?.publicationInfo?.price}
            />
          ))}
          <footer
            style={{
              mx: "48px",
            }}
          >
            <Divider width="100%" />
            <Box
              mx="48px"
              mb={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>One Wire</Typography>
              <Typography>www.onewire.com</Typography>
            </Box>
          </footer>
        </section>
      </Box>
    </>
  );
}

export default PressReleaseReport;

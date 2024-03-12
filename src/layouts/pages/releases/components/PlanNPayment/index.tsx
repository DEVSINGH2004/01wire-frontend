/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import DefaultPricingCard from "../DefaultPricingCard";
import ComplexProjectCard from "../ComplexProjectCard"
import { useMaterialUIController } from "context";

import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoXD from "assets/images/small-logos/logo-xd.svg";
import logoAsana from "assets/images/small-logos/logo-asana.svg";
import logoInvision from "assets/images/small-logos/logo-invision.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";



// NewProduct page components
import FormField from "../FormField";

function PlanNPayment(): JSX.Element {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500
  };
  return (
    <MDBox>
      <MDTypography variant="h5">Bundles</MDTypography>
      <MDBox
            display="flex"
            flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor={ "grey-200"}
      borderRadius="lg"
      p={3}
      mb={ 1}
      mt={2}
      >
       


          <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} lg={4}>
          <DefaultPricingCard
            color={darkMode ? "dark" : "white"}
            badge={{ color: darkMode ? "warning" : "light", label: "starter" }}
            price={{ currency: "$", value: "234", type: "mo" }}
            specifications={[
              { label: "2 team members", includes: true },
              { label: "20GB Cloud storage", includes: true },
              { label: "Integration help", includes: false },
              { label: "Sketch Files", includes: false },
              { label: "API Access", includes: false },
              { label: "Complete documentation", includes: false },
            ]}
            action={{
              type: "internal",
              route: "/",
              color: darkMode ? "warning" : "dark",
              label: "join",
            }}
            shadow={darkMode}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <DefaultPricingCard
            color="dark"
            badge={{ color: "info", label: "premium" }}
            price={{ currency: "$", value: "premium", type: "mo" }}
            specifications={[
              { label: "10 team members", includes: true },
              { label: "40GB Cloud storage", includes: true },
              { label: "Integration help", includes: true },
              { label: "Sketch Files", includes: true },
              { label: "API Access", includes: false },
              { label: "Complete documentation", includes: false },
            ]}
            action={{
              type: "internal",
              route: "/",
              color: "info",
              label: "try premium",
            }}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <DefaultPricingCard
            color={darkMode ? "dark" : "white"}
            badge={{ color: darkMode ? "warning" : "light", label: "enterprise" }}
            price={{ currency: "$", value: "enterprise", type: "mo" }}
            specifications={[
              { label: "Unlimited team members", includes: true },
              { label: "100GB Cloud storage", includes: true },
              { label: "Integration help", includes: true },
              { label: "Sketch Files", includes: true },
              { label: "API Access", includes: true },
              { label: "Complete documentation", includes: true },
            ]}
            action={{
              type: "internal",
              route: "/",
              color: darkMode ? "warning" : "dark",
              label: "join",
            }}
            shadow={darkMode}
          />
        </Grid>
      </Grid>
      </MDBox>
      <MDBox py={2} display="flex" justifyContent="space-between">
        <MDTypography variant="h5">Publications</MDTypography>
            <MDBox width="173px" ml="auto">
              <MDInput
                placeholder="Search..."
                size="small"
                fullWidth
                // onChange={({ currentTarget }: any) => {
                //   setSearch(search);
                //   onSearchChange(currentTarget.value);
                // }}
              />
            </MDBox>
      </MDBox>
      <MDBox mt={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={1.5} mt={1.5} variant="gradient">
                <ComplexProjectCard
                  image={logoSlack}
                  title="slack bot"
                  description="If everything I did failed - which it doesn't, I think that it actually succeeds."
                  dateTime="02.03.22"
                  members={["qweqwe", "qweqwe"]}
                  // dropdown={{
                  //   action: openSlackBotMenu,
                  //   menu: renderMenu(slackBotMenu, closeSlackBotMenu),
                  // }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={1.5} mt={1.5}>
                <ComplexProjectCard
                  image={logoSpotify}
                  title="premium support"
                  description="Pink is obviously a better color. Everyone’s born confident, and everything’s taken away from you."
                  dateTime="22.11.21"
                  members={["qweqwe", "qweqwe"]}
                  // dropdown={{
                  //   action: openPremiumSupportMenu,
                  //   menu: renderMenu(premiumSupportMenu, closePremiumSupportMenu),
                  // }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={1.5} mt={1.5}>
                <ComplexProjectCard
                  image={logoXD}
                  title="design tools"
                  description="Constantly growing. We’re constantly making mistakes from which we learn and improve."
                  dateTime="06.03.20"
                  members={["qweqwe", "qweqwe"]}
                  // dropdown={{
                  //   action: openDesignToolsMenu,
                  //   menu: renderMenu(designToolsMenu, closeDesignToolsMenu),
                  // }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={1.5} mt={1.5}>
                <ComplexProjectCard
                  image={logoAsana}
                  title="looking great"
                  description="You have the opportunity to play this game of life you need to appreciate every moment."
                  dateTime="14.03.24"
                  members={["team1", "team2", "team3", "team4", "team5", "team3"]}
                  // dropdown={{
                  //   action: openLookingGreatMenu,
                  //   menu: renderMenu(lookingGreatMenu, closeLookingGreatMenu),
                  // }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={1.5} mt={1.5}>
                <ComplexProjectCard
                  image={logoInvision}
                  title="developer first"
                  description="For standing out. But the time is now to be okay to be the greatest you."
                  dateTime="16.01.22"
                  members={["team1", "team2", "team3", "team4"]}
                  // dropdown={{
                  //   action: openDeveloperFirstMenu,
                  //   menu: renderMenu(developerFirstMenu, closeDeveloperFirstMenu),
                  // }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={1.5} mt={1.5}>
                <ComplexProjectCard
                  image={logoAtlassian}
                  title="Product Development"
                  description="We strive to embrace and drive change in our industry. We are project."
                  dateTime="16.01.22"
                  members={["team1", "team2", "team3", "team4"]}
                  // dropdown={{
                  //   action: openDeveloperFirstMenu,
                  //   menu: renderMenu(developerFirstMenu, closeDeveloperFirstMenu),
                  // }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
    </MDBox>
  );
}

export default PlanNPayment;

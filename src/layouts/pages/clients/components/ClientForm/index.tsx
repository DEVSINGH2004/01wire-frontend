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

import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// NewProduct page components
import ClientInfo from "../ClientInfo";
import SocialInfo from "../SocialInfo";
// import PlanNPayment from "../PlanNPayment";
// import ReviewNPublish from "../ReviewNPublish";

interface Props {
  onClose: (p: boolean) => void;
}

function getSteps(): string[] {
  return ["Client Info", "Social Media Info"];
}

function getStepContent(stepIndex: number): JSX.Element {
  switch (stepIndex) {
    case 0:
      return <ClientInfo/>;
    case 1:
      return <SocialInfo/>;
   
    
    default:
      return null;
  }
}

function ClientForm({ onClose }: Props): JSX.Element {
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = getSteps();
  const isLastStep: boolean = activeStep === steps.length - 1;

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);

  return (
    <>
      <MDBox mt={-3} mb={3} mx={2}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{
         background: `
          linear-gradient(180deg, #F7595F 0%, #F8303C 100%)
          `
        }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </MDBox>
      <MDBox p={2}>
        <MDBox>
          {getStepContent(activeStep)}
          <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
            {activeStep === 0 ? (
              <MDBox />
            ) : (
              <MDButton variant="gradient" color="light" onClick={handleBack}>
                back
              </MDButton>
            )}
            <MDButton
              variant="gradient"
              color="dark"
              onClick={!isLastStep ? handleNext : undefined}
            >
              {isLastStep ? "send" : "next"}
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </>
  );
}

export default ClientForm;

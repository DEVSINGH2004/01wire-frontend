import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import ClientInfo from "../ClientInfo";
import SocialInfo from "../SocialInfo";
import {
  GET_CLIENT_BY_ID,
  IGetClientByIdVars,
  IGetClientById,
} from "graphql/queries/getClientById";
import MDCircularLoader from "components/MDCircularLoader";
interface Props {
  id: any;
  onClose: () => void;
  refetchList: () => void;
}

function getSteps(): string[] {
  return ["Client Info", "Social Media Info"];
}

function getStepContent(
  stepIndex: number,
  saveData: boolean,
  handleNext: any,
  client: any,
  refetch: any,
  handleLastClick: any,
  setSaveData: any
): JSX.Element {
  switch (stepIndex) {
    case 0:
      return (
        <ClientInfo
          saveData={saveData}
          cb={handleNext}
          data={client}
          refetch={refetch}
          setSaveData={setSaveData}
        />
      );
    case 1:
      return (
        <SocialInfo
          saveData={saveData}
          cb={handleNext}
          data={client}
          refetch={handleLastClick}
          setSaveData={setSaveData}
        />
      );

    default:
      return null;
  }
}

function ClientForm({ id, refetchList, onClose }: Props): JSX.Element {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [saveData, setSaveData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [client, setClient] = useState<any>();
  const [clientId, setId] = useState<any>(id && id !== true && id);
  const steps = getSteps();
  const isLastStep: boolean = activeStep === steps.length - 1;
  const [getClientById] = useLazyQuery<IGetClientById, IGetClientByIdVars>(GET_CLIENT_BY_ID, {
    fetchPolicy: "network-only",
  });

  const handleNext = (newId?: any) => {
    console.log("newId", newId);
    if (newId) setId(newId);
    setSaveData(false);
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    if (saveData) setSaveData(false);
    setActiveStep(activeStep - 1);
  };
  const fetchData = (resId?: any) => {
    console.log("fetchData", resId);
    setLoading(true);
    getClientById({
      variables: {
        id: clientId || resId,
      },
    })
      .then((res: any) => {
        console.log("clientById", res);
        setClient(res?.data?.getClientById);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log("err while fetching client detail", err);
      });
  };
  useEffect(() => {
    if (clientId) {
      fetchData();
    }
  }, [clientId]);
  const handleLastClick = () => {
    refetchList();
    onClose();
  };
  return (
    <>
      <MDBox mt={-3} mb={3} mx={2}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            background: `
          linear-gradient(180deg, #F7595F 0%, #F8303C 100%)
          `,
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </MDBox>
      <MDBox p={2}>
        <MDBox>
          {loading ? (
            <MDCircularLoader startLoader />
          ) : (
            getStepContent(
              activeStep,
              saveData,
              handleNext,
              client,
              fetchData,
              handleLastClick,
              setSaveData
            )
          )}
          <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
            {activeStep === 0 ? (
              <MDBox />
            ) : (
              <MDButton variant="gradient" color="light" onClick={handleBack}>
                back
              </MDButton>
            )}
            <MDButton variant="gradient" color="dark" onClick={() => setSaveData(true)}>
              {isLastStep ? "save" : "next"}
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </>
  );
}

export default ClientForm;

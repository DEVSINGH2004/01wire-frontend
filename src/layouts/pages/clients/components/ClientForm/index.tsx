import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
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
  id?: any;
  onClose?: () => void;
  refetchList?: () => void;
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
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(location?.state?.step ? 1 : 0);
  const [saveData, setSaveData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
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
  // const handleBack = () => {
  //   if (saveData) setSaveData(false);
  //   setActiveStep(activeStep - 1);
  // };
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
    } else {
      setLoading(false);
    }
  }, [clientId]);
  const handleLastClick = () => {
    if (refetchList) refetchList();
    if (onClose) onClose();
    navigate(`/clients`);
  };
  return (
    <>
      <MDBox p={2}>
        <MDBox>
          {loading ? (
            <MDCircularLoader startLoader />
          ) : (
            <ClientInfo
              saveData={saveData}
              data={client}
              refetch={refetchList}
              onClose={onClose}
              setSaveData={setSaveData}
            />
          )}
          {!loading && (
            <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
              <MDButton color="primary" onClick={() => setSaveData(true)}>
                Save
              </MDButton>
            </MDBox>
          )}
        </MDBox>
      </MDBox>
    </>
  );
}

export default ClientForm;

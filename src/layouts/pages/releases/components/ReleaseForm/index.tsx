import { useState, useEffect } from "react";
// @mui material components
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDCircularLoader from "components/MDCircularLoader";
// NewProduct page components
import AddPress from "../AddPress";
import Media from "../Media";
import PlanNPayment from "../PlanNPayment";
import ReviewNPublish from "../ReviewNPublish";
import { useLazyQuery } from "@apollo/client";
import {
  GET_ARTICLE_BY_ID,
  IGetArticleByIdVars,
  IGetArticleById,
} from "graphql/queries/getArticleById";
import { useParams } from "react-router-dom";

interface Props {
  onClose?: (p: boolean) => void;
  idVal?: any;
}

function getSteps(): string[] {
  return ["Add Press Release", "Category & Media", "Plan & Payment", "Review & Publish"];
}

function getStepContent(
  stepIndex: number,
  saveData: boolean,
  handleNext: any,
  article: any,
  fetchData: any
): JSX.Element {
  switch (stepIndex) {
    case 0:
      return <AddPress cb={handleNext} saveData={saveData} data={article} refetch={fetchData} />;
    case 1:
      return <Media cb={handleNext} saveData={saveData} data={article} refetch={fetchData} />;
    case 2:
      return (
        <PlanNPayment cb={handleNext} saveData={saveData} data={article} refetch={fetchData} />
      );
    case 3:
      return <ReviewNPublish data={article} />;
    default:
      return null;
  }
}

function ReleaseForm({ onClose, idVal }: Props): JSX.Element {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [saveData, setSaveData] = useState<boolean>(false);
  const [articleId, setId] = useState<string>(idVal || id);
  const [article, setArticle] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const steps = getSteps();
  const isLastStep: boolean = activeStep === steps.length - 1;

  const handleNext = (id?: any) => {
    if (id) setId(id);
    setSaveData(false);
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    if (saveData) setSaveData(false);
    setActiveStep(activeStep - 1);
  };

  const [getArticleById] = useLazyQuery<IGetArticleById, IGetArticleByIdVars>(GET_ARTICLE_BY_ID, {
    fetchPolicy: "network-only",
  });
  const fetchData = () => {
    setLoading(true);
    getArticleById({
      variables: {
        id: articleId,
      },
    })
      .then((res: any) => {
        setArticle(res?.data?.getArticleById);
        setLoading(false);
      })
      .catch((err) => {
        console.log("error in detail fetching", err);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (articleId) {
      fetchData();
    }
  }, [articleId]);
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
            <MDCircularLoader overlayloader startLoader />
          ) : (
            getStepContent(activeStep, saveData, handleNext, article, fetchData)
          )}
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
              onClick={!isLastStep ? () => setSaveData(true) : undefined}
            >
              {isLastStep ? "send" : "next"}
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </>
  );
}

export default ReleaseForm;

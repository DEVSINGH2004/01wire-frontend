import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  GET_ARTICLE_BY_ID,
  IGetArticleByIdVars,
  IGetArticleById,
} from "graphql/queries/getArticleById";
import MDTypography from "components/MDTypography";
import { GET_USER_WALLET, IGetUserWallet } from "graphql/queries/getUserWallet";
import {
  UPDATE_ARTICLE_STATUS,
  IUpdateArticleStatusVars,
} from "graphql/mutations/updateArticleStatus";
interface Props {
  onClose?: () => void;
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
  fetchData: any,
  setSaveData: any
): JSX.Element {
  switch (stepIndex) {
    case 0:
      return (
        <AddPress
          cb={handleNext}
          saveData={saveData}
          data={article}
          refetch={fetchData}
          setSaveData={setSaveData}
        />
      );
    case 1:
      return (
        <Media
          cb={handleNext}
          saveData={saveData}
          data={article}
          refetch={fetchData}
          setSaveData={setSaveData}
        />
      );
    case 2:
      return (
        <PlanNPayment
          cb={handleNext}
          saveData={saveData}
          data={article}
          refetch={fetchData}
          setSaveData={setSaveData}
        />
      );
    case 3:
      return <ReviewNPublish id={article?.id} />;
    default:
      return null;
  }
}

function ReleaseForm({ idVal, onClose }: Props): JSX.Element {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [saveData, setSaveData] = useState<boolean>(false);
  const [articleId, setId] = useState<string>(idVal && idVal !== true && idVal);
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
    if(activeStep === 0){
      onClose()
    }else{
    if (saveData) setSaveData(false);
    setActiveStep(activeStep - 1);
  }
  };
  const [updateArticleStatus] = useMutation<IUpdateArticleStatusVars>(UPDATE_ARTICLE_STATUS);
  const [getArticleById] = useLazyQuery<IGetArticleById, IGetArticleByIdVars>(GET_ARTICLE_BY_ID, {
    fetchPolicy: "network-only",
  });
  const { data: userWallet } = useQuery<IGetUserWallet>(GET_USER_WALLET, {
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
  const handleSend = () => {
    updateArticleStatus({
      variables: {
        params: {
          id: article?.id,
          status: "SUBMITTED",
        },
      },
    })
      .then(() => {
        toast.success("Submitted successfully");
      })
      .catch((err) => {
        toast.error(err?.message);
      });
  };
  const handleAddCredits = () => {
    navigate("/my-credits");
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
            <>{getStepContent(activeStep, saveData, handleNext, article, fetchData, setSaveData)}</>
          )}
        </MDBox>
      </MDBox>
      <MDBox
        mt={3}
        width="102.47%"
        display="flex"
        justifyContent="space-between"
        bgColor="white"
        sx={{
          position: "sticky",
          bottom: 0,
          marginLeft: "-1.2%",
          padding: "2rem 1rem",
          boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
          zIndex: 1000,
        }}
      >
        {/* {activeStep === 0 ? (
          <MDBox />
        ) : ( */}
          <MDTypography
            fontSize="16px"
            sx={{
              fontWeight: 400,
              fontFamily: "Roboto",
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handleBack}
          >
            {"< Back"}
          </MDTypography>
        {/* )} */}
        <MDButton
          color="primary"
          onClick={
            !isLastStep
              ? () => setSaveData(true)
              : article?.totalCredits <= userWallet?.getUserWallet?.balance
              ? handleSend
              : handleAddCredits
          }
        >
          {isLastStep
            ? article?.totalCredits <= userWallet?.getUserWallet?.balance
              ? "send"
              : "Add Credits"
            : "next"}
        </MDButton>
      </MDBox>
    </>
  );
}

export default ReleaseForm;

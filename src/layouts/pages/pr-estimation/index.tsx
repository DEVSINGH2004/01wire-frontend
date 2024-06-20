import { useState } from "react";
import MDBox from "components/MDBox";
import MDCircularLoader from "components/MDCircularLoader";
import PlanNPayment from "../releases/components/PlanNPayment";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CreateEstimation from "./components/CreateEstimateModal";

const PREstimation = () => {
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const handleChange = (values: any) => {
    setOpen(values);
  };
  return (
    <MDBox>
      <DashboardNavbar text="PR Estimation" />
      <MDBox px={2} py={3}>
        {loader && <MDCircularLoader startLoader overlayloader />}
        <PlanNPayment createEstimate={handleChange} />
      </MDBox>
      {open && <CreateEstimation values={open} onClose={() => setOpen(false)} />}
    </MDBox>
  );
};
export default PREstimation;

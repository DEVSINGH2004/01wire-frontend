import { useState } from "react";
import { toast } from "react-toastify";
import MDBox from "components/MDBox";
import MDCircularLoader from "components/MDCircularLoader";
import { useQuery } from "@apollo/client";
import { GET_ESTIMATES, IGetEstimatesVars } from "graphql/queries/filterEstimatesPaginated";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "../pr-management/components/DataTable";

const MyEstimates = () => {
  const [loader, setLoader] = useState(false);

  return (
    <MDBox>
      <DashboardNavbar text="My Estimates" />
      <MDBox px={2} py={3}>
        {loader && <MDCircularLoader startLoader overlayloader />}
      </MDBox>
    </MDBox>
  );
};
export default MyEstimates;

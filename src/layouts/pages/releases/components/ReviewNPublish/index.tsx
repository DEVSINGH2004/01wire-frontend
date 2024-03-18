// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import AddPress from "../AddPress";
import Media from "../Media";
import PlanNPayment from "../PlanNPayment";

// NewProduct page components
import FormField from "../FormField";

function ReviewNPublish({ data }: { data: any }): JSX.Element {
  return (
    <MDBox>
      <AddPress data={data} />
      <Media data={data} />
      <PlanNPayment data={data} />
    </MDBox>
  );
}

export default ReviewNPublish;

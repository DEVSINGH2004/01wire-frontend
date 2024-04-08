// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import AddPress from "../AddPress";
import Media from "../Media";
import PlanNPayment from "../PlanNPayment";

function ReviewNPublish({ data }: { data: any }): JSX.Element {
  return (
    <MDBox>
      <AddPress data={data} disabled />
      <Media data={data} disabled />
      <PlanNPayment data={data} disabled />
    </MDBox>
  );
}

export default ReviewNPublish;

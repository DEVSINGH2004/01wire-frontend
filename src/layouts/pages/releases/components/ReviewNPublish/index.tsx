import { useQuery } from "@apollo/client";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDCircularLoader from "components/MDCircularLoader";
import AddPress from "../AddPress";
import Media from "../Media";
import PlanNPayment from "../PlanNPayment";
import {
  GET_ARTICLE_BY_ID_RNP,
  IGetArticleById,
  IGetArticleByIdVars,
} from "graphql/queries/getArticleByIdNew";

function ReviewNPublish({ id }: { id: any }): JSX.Element {
  const { data, loading } = useQuery<IGetArticleById, IGetArticleByIdVars>(GET_ARTICLE_BY_ID_RNP, {
    fetchPolicy: "network-only",
    variables: {
      id,
    },
  });
  return (
    <MDBox>
      {loading ? (
        <MDCircularLoader overlayloader startLoader />
      ) : (
        <>
          <AddPress data={data?.getArticleById} disabled />
          <Media data={data?.getArticleById} disabled />
          <PlanNPayment data={data?.getArticleById} disabled />
        </>
      )}
    </MDBox>
  );
}

export default ReviewNPublish;

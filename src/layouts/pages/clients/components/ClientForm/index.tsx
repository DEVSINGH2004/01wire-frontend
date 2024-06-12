import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import ClientInfo from "../ClientInfo";
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

function ClientForm({ id, refetchList, onClose }: Props): JSX.Element {
  const navigate = useNavigate();
  const [saveData, setSaveData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [client, setClient] = useState<any>();
  const clientId = id && id !== true && id;
  const [getClientById] = useLazyQuery<IGetClientById, IGetClientByIdVars>(GET_CLIENT_BY_ID, {
    fetchPolicy: "network-only",
  });

  const fetchData = (resId?: any) => {
    setLoading(true);
    getClientById({
      variables: {
        id: clientId || resId,
      },
    })
      .then((res: any) => {
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
  const handleCloseForm = () => {
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
              <MDButton color="white" onClick={handleCloseForm}>
                <MDTypography fontSize="16px" fontWeight="regular" sx={{ fontFamily: "Roboto" }}>
                  {"< Back"}
                </MDTypography>
              </MDButton>
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

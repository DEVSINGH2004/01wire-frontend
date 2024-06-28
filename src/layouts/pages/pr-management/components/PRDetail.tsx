import { useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import MDBox from "components/MDBox";
import MDCircularLoader from "components/MDCircularLoader";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Divider from "@mui/material/Divider";
import ReviewNPublish from "layouts/pages/releases/components/ReviewNPublish";
import Autocomplete from "@mui/material/Autocomplete";
import {
  UPDATE_ARTICLE_STATUS,
  IUpdateArticleStatusVars,
} from "graphql/mutations/updateArticleStatus";
import { StatusOptions } from "constants/index";
import RejectPR from "./RejectPRModal";

const PRDetail = ({ onClose, refetch, id }: { onClose: any; refetch: any; id: any }) => {
  const [updateArticleStatus] = useMutation<IUpdateArticleStatusVars>(UPDATE_ARTICLE_STATUS);
  const [status, setStatus] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const handleUpdateStatus = () => {
    console.log("status", status);
    if (status === "REJECTED") {
      setOpen(true);
    } else {
      setLoader(true);
      updateArticleStatus({
        variables: {
          params: {
            id,
            status,
          },
        },
      })
        .then(() => {
          setLoader(false);
          refetch();
          toast.success("Submitted successfully");
          onClose();
        })
        .catch((err) => {
          toast.error(err?.message);
          setLoader(false);
        });
    }
  };
  return (
    <MDBox p={2}>
      {loader && <MDCircularLoader overlayloader startLoader />}
      {open && <RejectPR id={id} status={status} onClose={() => setOpen(false)} />}
      <MDBox display="flex" alignItems="center">
        <IconButton onClick={onClose}>
          <ArrowBackIosIcon />
        </IconButton>
      </MDBox>
      <MDBox mt={3}>
        <ReviewNPublish id={id} />
      </MDBox>
      <Divider
        sx={{
          borderColor: "#B2B2B2",
          borderStyle: "dotted",
        }}
      />
      <MDBox display="flex" alignItems="center" justifyContent="space-between">
        <MDButton color="light" sx={{ color: "#000" }} variant="contained" onClick={onClose}>
          Cancel
        </MDButton>
        {/* {["DRAFT","AWAITING_APPROVAL","REJECTED","PUBLISHE"].includes(status) && ( */}
        <MDBox display="flex" alignItems="center">
          <MDBox mr={3}>
            <Autocomplete
              disableClearable
              options={StatusOptions}
              onChange={(event, option: any) => {
                setStatus(option?.value);
              }}
              value={status && StatusOptions?.find((one: any) => one?.value === status)}
              size="small"
              sx={{ width: "12rem" }}
              renderInput={(params) => <MDInput label="Status" {...params} />}
            />
          </MDBox>
          <MDButton
            disabled={!status}
            color="primary"
            variant="contained"
            onClick={handleUpdateStatus}
          >
            Update
          </MDButton>
        </MDBox>
        {/* )} */}
      </MDBox>
    </MDBox>
  );
};
export default PRDetail;

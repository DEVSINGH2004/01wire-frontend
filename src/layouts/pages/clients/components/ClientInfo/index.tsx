import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MDBox from "components/MDBox";
import { useForm } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { useMutation } from "@apollo/client";
import { CREATE_CLIENT, ICreateClientVars } from "graphql/mutations/createClient";
import { UPDATE_CLIENT, IUpdateClientVars } from "graphql/mutations/updateClient";
import FormField from "layouts/pages/releases/components/FormField";
import MDCircularLoader from "components/MDCircularLoader";
import MDTypography from "components/MDTypography";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import { removeEmptyFields } from "utils/helpers";

const ComanyTypeOptions = [
  { label: "Public", value: "PUBLIC" },
  { label: "Private", value: "PRIVATE" },
];
const IndustryTypeOptions = [
  { label: "Agriculture", value: "AGRICULTURE" },
  { label: "Finance", value: "FINANCE" },
  { label: "Healthcare", value: "HEALTHCARE" },
  { label: "Education", value: "EDUCATION" },
  { label: "Manufacturing", value: "MANUFACTURING" },
  { label: "Retail", value: "RETAIL" },
  { label: "Marketing", value: "MARKETING" },
];

function ClientInfo({
  saveData,
  data,
  refetch,
  onClose,
  setSaveData,
}: {
  saveData: any;
  data: any;
  refetch: any;
  onClose: any;
  setSaveData: any;
}): JSX.Element {
  const {
    control,
    formState: { isDirty },
    handleSubmit,
    reset,
  } = useForm({ defaultValues: { category: null, type: null } });
  const [loading, setLoading] = useState<boolean>(false);
  const [createClient] = useMutation<ICreateClientVars>(CREATE_CLIENT);
  const [updateClient] = useMutation<IUpdateClientVars>(UPDATE_CLIENT);
  const navigate = useNavigate();
  useEffect(() => {
    if (data?.id) {
      const { title, logo, type, email, website, category, notes, social = {} } = data;
      const { facebook, instagram, youtube, twitter, others, linkedIn } = social;
      const defaultValues = {
        title,
        type: type && ComanyTypeOptions?.find((one) => one?.value === type),
        category: category && IndustryTypeOptions?.find((one) => one?.value === category),
        email,
        logo,
        notes,
        website,
        facebook,
        instagram,
        youtube,
        twitter,
        others,
        linkedIn,
      };
      reset(defaultValues);
    }
  }, [data]);

  const onSubmit = async (formVals: any) => {
    formVals = removeEmptyFields(formVals);
    setLoading(true);
    let res: any;
    const {
      title,
      logo,
      email,
      website,
      facebook,
      youtube,
      linkedIn,
      twitter,
      instagram,
      others,
      notes,
    } = formVals;
    let social: any = {
      facebook,
      youtube,
      linkedIn,
      twitter,
      instagram,
      others,
    };
    social = removeEmptyFields(social);
    try {
      if (data?.id) {
        res = await updateClient({
          variables: {
            params: {
              id: data.id,
              title,
              logo,
              email,
              website,
              notes,
              type: formVals?.type?.value,
              category: formVals?.category?.value,
              social,
            },
          },
        });
      } else {
        res = await createClient({
          variables: {
            params: {
              title,
              logo,
              email,
              website,
              type: formVals?.type?.value,
              category: formVals?.category?.value,
              social,
              notes,
            },
          },
        });
      }
      setLoading(false);
      toast.success(data?.id ? "Updated Successfully" : "Saved Successfully");
      if (refetch) refetch();
      onClose();
      navigate("/clients");
    } catch (err: any) {
      console.error("Error in saving data:", err);
      setLoading(false);
      toast.error(err?.message);
      setSaveData(false);
    }
  };

  useEffect(() => {
    if (saveData && isDirty) {
      handleSubmit(onSubmit)();
    } else if (saveData) {
      toast.info("No changes to save");
      setSaveData(false);
    }
  }, [saveData, isDirty]);

  return (
    <MDBox>
      {loading && <MDCircularLoader overlayloader startLoader />}
      <MDBox mt={2} display="flex" alignItems="center">
        <MDTypography variant="h5">Client Info</MDTypography>
      </MDBox>
      <MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={7}>
            <FormField
              type="text"
              label="Company Name"
              name="title"
              control={control}
              variant="outlined"
            />
            {/* <FormField
              type="dropdown"
              placeholder="Select Company Tye"
              label="Company Type"
              name="type"
              control={control}
              options={ComanyTypeOptions}
              variant="outlined"
            /> */}
            <FormField
              type="radio"
              placeholder="Select Company Tye"
              label="Company Type"
              name="type"
              control={control}
              opt={ComanyTypeOptions}
              variant="outlined"
            />
            <FormField
              type="dropdown"
              placeholder="Select Industry Tye"
              label="Industry Type"
              name="category"
              control={control}
              options={IndustryTypeOptions}
              variant="outlined"
            />
            <FormField
              type="text"
              label="Email"
              name="email"
              control={control}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormField
              type="text"
              label="Website"
              name="website"
              control={control}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <LanguageOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormField
              type="file"
              subLabel="JPEG, PNG, JPG(max. 3MB)"
              name="logo"
              label="Logo"
              control={control}
            />
            <FormField
              type="text"
              label="Notes"
              name="notes"
              control={control}
              multiline
              rows={6}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </MDBox>
      <MDBox mt={2} display="flex" alignItems="center">
        <MDTypography variant="h5">Social Media Info</MDTypography>
        <Divider sx={{ ml: 1, flexGrow: 1, mr: 2, bgcolor: "#000", height: "1px" }} />
      </MDBox>
      <MDBox>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <FormField
              type="text"
              label="Facebook"
              name="facebook"
              control={control}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <FacebookIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormField
              type="text"
              label="Linkedin"
              name="linkedIn"
              control={control}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <LinkedInIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormField
              type="text"
              label="Youtube"
              name="youtube"
              control={control}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <YouTubeIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type="text"
              label="Instagram"
              name="instagram"
              control={control}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <InstagramIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormField
              type="text"
              label="X"
              name="twitter"
              control={control}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <XIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormField
              type="text"
              label="Others"
              name="others"
              control={control}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <MoreHorizIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default ClientInfo;

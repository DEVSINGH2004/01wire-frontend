import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import InputAdornment from "@mui/material/InputAdornment";
import InfoIconOutlined from "@mui/icons-material/InfoOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import XIcon from "@mui/icons-material/X";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { countryList } from "constants/index";

// NewProduct page components
import FormField from "../FormField";
import { Divider } from "@mui/material";
import { UPDATE_ARTICLE, IUpdateArticleVars } from "graphql/mutations/updateArticle";

const CategoryOptions = [
  { label: "Partnership", value: "PARTNERSHIP" },
  { label: "Fund Raising", value: "FUND_RAISING" },
];
interface Props {
  cb?: any;
  saveData?: boolean;
  data?: any;
  refetch?: () => void;
  disabled?: any;
  setSaveData?: any;
}

function Media({ cb, saveData, data, refetch, disabled = false, setSaveData }: Props): JSX.Element {
  const {
    control,
    formState: { errors, isDirty },
    reset,
    handleSubmit,
  } = useForm({ defaultValues: { category: "", country: "" } });
  const [loading, setLoading] = useState<boolean>(false);
  const [updateArticle] = useMutation<IUpdateArticleVars>(UPDATE_ARTICLE);
  const onSubmit = (formVals: any) => {
    setLoading(true);
    const {
      name,
      email,
      phone,
      website,
      address,
      state,
      country,
      facebook,
      instagram,
      linkedIn,
      twitter,
      youtube,
      others,
      category,
      instructions,
    } = formVals;
    updateArticle({
      variables: {
        params: {
          id: data?.id,
          category: category?.value,
          instructions,
          mediaContact: {
            name,
            email,
            phone,
            website,
            address,
            state,
            country,
            facebook,
            instagram,
            linkedIn,
            twitter,
            youtube,
            others,
          },
        },
      },
    })
      .then((res: any) => {
        setLoading(false);
        toast.success("Saved Successfully");
        if (refetch) refetch();
        const resId = res?.data?.updateArticle?.id;
        cb(resId);
      })
      .catch((err: any) => {
        console.log("error in saving data", err);
        setLoading(false);
        setSaveData(false);
        toast.error(err?.message);
      });
  };
  useEffect(() => {
    if (saveData && isDirty) {
      handleSubmit(onSubmit)();
    } else if (saveData) {
      cb();
    }
  }, [saveData, isDirty]);
  useEffect(() => {
    if (data?.id) {
      const { category, instructions, mediaContact } = data;
      const filteredCategory = CategoryOptions?.find((one) => one.value === category);
      const defaultValues = {
        category: filteredCategory,
        instructions,
        ...mediaContact,
      };
      reset(defaultValues);
    }
  }, [data]);
  return (
    <MDBox>
      {loading && <MDCircularLoader overlayloader startLoader />}
      <MDBox mt={3}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <FormField
              type="dropdown"
              placeholder="Select Category"
              label="Category"
              name="category"
              control={control}
              options={CategoryOptions}
              variant="outlined"
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type="text"
              label="Special Instructions"
              name="instructions"
              control={control}
              multiline
              rows={6}
              variant="outlined"
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </MDBox>
      <MDBox mt={2} display="flex" alignItems="center">
        <MDTypography variant="h5">Media Contact</MDTypography> <InfoIconOutlined color="action" />
        <Divider sx={{ width: "80%", p: 0 }} orientation="horizontal" />
      </MDBox>
      <MDBox mt={2}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <FormField
              type="text"
              label="Name"
              name="name"
              control={control}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              disabled={disabled}
            />
            <FormField
              type="text"
              label="Phone"
              name="phone"
              control={control}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <LocalPhoneOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type="email"
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
              disabled={disabled}
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
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </MDBox>
      <MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <FormField
              type="text"
              label="Address"
              name="address"
              control={control}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <HomeOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </MDBox>
      <MDBox>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <FormField
              type="text"
              label="State"
              name="state"
              control={control}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <HomeOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              disabled={disabled}
            />
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type="dropdown"
              placeholder="Select Country"
              label="Country"
              name="country"
              control={control}
              options={Object.keys(countryList)}
              variant="outlined"
              disabled={disabled}
            />
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default Media;

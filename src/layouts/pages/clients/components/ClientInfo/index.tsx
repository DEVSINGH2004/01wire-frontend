import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
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
  cb,
  data,
  refetch,
  setSaveData,
}: {
  saveData: any;
  cb: any;
  data: any;
  refetch: any;
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

  useEffect(() => {
    if (data?.id) {
      const { title, logo, type, email, website, category } = data;
      const defaultValues = {
        title,
        type: type && ComanyTypeOptions?.find((one) => one?.value === type),
        category: category && IndustryTypeOptions?.find((one) => one?.value === category),
        email,
        logo,
        website,
      };
      reset(defaultValues);
    }
  }, [data]);

  const onSubmit = async (formVals: any) => {
    setLoading(true);
    let res: any;
    try {
      if (data?.id) {
        res = await updateClient({
          variables: {
            params: {
              id: data.id,
              ...formVals,
              type: formVals?.type?.value,
              category: formVals?.category?.value,
            },
          },
        });
      } else {
        res = await createClient({
          variables: {
            params: {
              ...formVals,
              type: formVals?.type?.value,
              category: formVals?.category?.value,
            },
          },
        });
      }
      setLoading(false);
      const resId = res?.data?.updateClient?.id || res?.data?.createClient?.id;
      if (refetch) refetch(resId);
      cb(resId);
    } catch (err) {
      console.error("Error in saving data:", err);
      setLoading(false);
      setSaveData(false);
    }
  };

  useEffect(() => {
    if (saveData && isDirty) {
      handleSubmit(onSubmit)();
    } else if (saveData) {
      cb();
    }
  }, [saveData, isDirty]);

  return (
    <MDBox>
      {loading && <MDCircularLoader overlayloader startLoader />}
      <MDBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={7}>
            <FormField
              type="text"
              label="Company Name"
              name="title"
              control={control}
              variant="outlined"
            />
            <FormField
              type="dropdown"
              placeholder="Select Company Tye"
              label="Company Type"
              name="type"
              control={control}
              options={ComanyTypeOptions}
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
              subLabel="SVG, PNG, JPG(max. 3MB)"
              name="logo"
              label="Logo"
              control={control}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default ClientInfo;

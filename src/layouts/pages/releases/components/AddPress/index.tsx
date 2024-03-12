
// @mui material components
import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useForm } from 'react-hook-form';


// NewProduct page components
import FormField from "../FormField";

function AddPress(): JSX.Element {

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: { email: '' } });


  return (
    <MDBox>
      <MDTypography variant="h5">Product Information</MDTypography>
      <MDBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={7}>
            <FormField type="text" label="Client" name="client" control={control} variant="outlined" />
            <FormField type="text" label="Title" name="title" control={control} variant="outlined" />
            <FormField type="text" label="Summary" name="summary" control={control} multiline rows={4} variant="outlined"/>
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormField type="file" subLabel="SVG, PNG, JPG(max. 3MB)" name="featureImage" label="Feature Image" />
            <FormField type="text"  placeholder="Image Description" name="imgDesc" control={control}  variant="outlined"/>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox mt={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
          <FormField type="editor" name="editor" control={control} label="Press Release Content" multiline rows={4} variant="outlined"/>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default AddPress;

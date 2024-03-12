
// @mui material components
import { useEffect } from "react";

import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useForm } from 'react-hook-form';
import InputAdornment from "@mui/material/InputAdornment"
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { useLazyQuery, useMutation } from "@apollo/client";

import {
  GET_CLIENT_BY_ID,
  IGetClientByIdVars,
  IGetClientById,
} from "graphql/queries/getClientById";

import {
  CREATE_CLIENT,
  ICreateClientVars,
} from "graphql/mutations/createClient";

import {
  UPDATE_CLIENT,
  IUpdateClientVars,
} from "graphql/mutations/updateClient";



// NewProduct page components
import FormField from "layouts/pages/releases/components/FormField";

function ClientInfo(): JSX.Element {
  const id: string = null;
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: { email: '' } });

  const [createClient] = useMutation<ICreateClientVars>(CREATE_CLIENT);
  const [updateClient] = useMutation<IUpdateClientVars>(UPDATE_CLIENT);

  const [getClientById] = useLazyQuery<IGetClientById, IGetClientByIdVars>(
    GET_CLIENT_BY_ID,
    {
      fetchPolicy: "network-only",
    }
  );

  // useEffect(() => {
  //   if (id) {
  //     getClientById({
  //       variables: {
  //         id
  //       }
  //     })
  //   }
  // },[id])

  return (
    <MDBox>
      <MDTypography variant="h5">Product Information</MDTypography>
      <MDBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={7}>
            <FormField type="text" label="Company Name" name="title" control={control} variant="outlined" />
            <FormField type="text" label="Industry Type" name="type" control={control} variant="outlined" />
            <FormField type="email" label="Email" name="name" control={control} variant="outlined" InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon />
                            </InputAdornment>
                          ),
            }} />
            <FormField type="text" label="Website" name="phone" control={control} variant="outlined"  InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <LanguageOutlinedIcon />
                            </InputAdornment>
                          ),
                        }} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormField type="file" name="featureImage" subLabel="SVG, PNG, JPG(max. 3MB)" label="Feature Image" />
            <FormField type="text"  placeholder="Image Description" name="imgDesc" control={control}  variant="outlined"/>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default ClientInfo;

import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useForm } from 'react-hook-form';
import InputAdornment from "@mui/material/InputAdornment"


import XIcon from '@mui/icons-material/X';

import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';





import FormField from "layouts/pages/releases/components/FormField";
import { Divider } from "@mui/material";

function SocialInfo(): JSX.Element {

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: { category: '' } });

  return (
    <MDBox>
      <MDBox mt={2} display="flex" alignItems="center">
        <MDTypography variant="h5">Social Media Info</MDTypography><Divider sx={{width:"80%",p:0}} orientation="horizontal" />
      </MDBox>
      <MDBox>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
         
            <FormField type="text" label="Facebook" name="phone" control={control} variant="outlined"  InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <FacebookIcon />
                            </InputAdornment>
                          ),
                        }} />
            <FormField type="text" label="Linkedin" name="name" control={control} variant="outlined"  InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <LinkedInIcon />
                            </InputAdornment>
                          ),
                        }} />
            <FormField type="text" label="Youtube" name="phone" control={control} variant="outlined"  InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <YouTubeIcon />
                            </InputAdornment>
                          ),
                        }} />
          </Grid>
          <Grid item xs={12} sm={6}>
       
            <FormField type="text" label="Instagram" name="phone" control={control} variant="outlined"  InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <InstagramIcon />
                            </InputAdornment>
                          ),
                        }} />
            <FormField type="text" label="X" name="name" control={control} variant="outlined"  InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <XIcon />
                            </InputAdornment>
                          ),
                        }} />
            <FormField type="text" label="Others" name="phone" control={control} variant="outlined"   InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <MoreHorizIcon />
                            </InputAdornment>
                          ),
                        }}/>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default SocialInfo;

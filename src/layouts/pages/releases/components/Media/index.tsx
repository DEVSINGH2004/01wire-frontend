import { useMemo } from "react";
import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useForm } from 'react-hook-form';
import InputAdornment from "@mui/material/InputAdornment"
import InfoIconOutlined from '@mui/icons-material/InfoOutlined';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";


import XIcon from '@mui/icons-material/X';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PublicIcon from '@mui/icons-material/Public';
import InstagramIcon from '@mui/icons-material/Instagram';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';





// NewProduct page components
import FormField from "../FormField";
import { Divider } from "@mui/material";

function Media(): JSX.Element {

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: { category: '' } });

  return (
    <MDBox>
      <MDBox mt={3}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <FormField type="dropdown" placeholder="Select Category" label="Category" name="category" control={control} options={["Extra Large", "Extra Small", "Large", "Medium", "Small"]} variant="outlined" />
            <FormField type="text" label="Title" name="title" control={control} variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormField type="text" label="Special Instructions" name="summary" control={control} multiline rows={4} variant="outlined"/>
            <FormField type="text"  placeholder="Image Description" name="imgDesc" control={control}  variant="outlined"/>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox mt={2} display="flex" alignItems="center">
        <MDTypography variant="h5">Media Contact</MDTypography> <InfoIconOutlined color="action" /><Divider sx={{width:"80%",p:0}} orientation="horizontal" />
      </MDBox>
      <MDBox mt={2}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
          <FormField type="text" label="Name" name="name" control={control} variant="outlined"  InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <AccountCircleOutlinedIcon />
                            </InputAdornment>
                          ),
                        }} />
            <FormField type="text" label="Phone" name="phone" control={control} variant="outlined"   InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <LocalPhoneOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}/>
          </Grid>
          <Grid item xs={12} sm={6}>
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
        </Grid>
      </MDBox>
      <MDBox >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
          <FormField type="text" label="Address" name="phone" control={control} variant="outlined"  InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <HomeOutlinedIcon />
                            </InputAdornment>
                          ),
                        }} />
          </Grid>
        </Grid>
      </MDBox>
      <MDBox>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
          <FormField type="text" label="State" name="name" control={control} variant="outlined"  InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <HomeOutlinedIcon />
                            </InputAdornment>
                          ),
                        }} />
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
          <FormField type="email" label="Country" name="name" control={control} variant="outlined"  InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <PublicIcon />
                            </InputAdornment>
                          ),
                        }} />
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

export default Media;

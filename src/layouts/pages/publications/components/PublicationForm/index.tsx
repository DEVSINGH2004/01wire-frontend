import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import { Divider } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import { useForm } from "react-hook-form";
import FormField from "layouts/pages/releases/components/FormField";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { CREATE_PUBLICATION, ICreatePublicationVars } from "graphql/mutations/createPublication";
import { GET_PUBLICATION_BY_ID, IGetPublicationByIdVars } from "graphql/queries/getPublicationById";
import { UPDATE_PUBLICATION, IUpdatePublicationVars } from "graphql/mutations/updatePublication";
import { genericValidations } from "utils/helpers";
import { TimelineOptions, LinkTypeOptions, CategoryOptions } from "constants/index";

const PublicationForm = ({
  onClose,
  disabled = false,
  refetch,
  id,
}: {
  onClose: any;
  disabled?: any;
  refetch: any;
  id: any;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    formState: { isDirty, errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      timeline: null,
      url: "",
      categories: [],
      linkType: null,
      price: null,
      image: "",
      dr: null,
      ur: null,
      da: null,
      pa: null,
      traffic: null,
    },
  });

  const [createPublication] = useMutation<ICreatePublicationVars>(CREATE_PUBLICATION);
  const [updatePublication] = useMutation<IUpdatePublicationVars>(UPDATE_PUBLICATION);
  const { data, loading: fetchLoading } = useQuery<IGetPublicationByIdVars>(GET_PUBLICATION_BY_ID, {
    variables: {
      id,
    },
    fetchPolicy: "network-only",
    skip: !id || id === true,
  });
  const onSubmit = async (formVals: any) => {
    if (!isDirty) {
      toast.info("Nothing to save");
      return;
    }
    setLoading(true);
    const {
      title,
      categories,
      image,
      linkType,
      timeline,
      price,
      da = 0,
      pa = 0,
      dr = 0,
      ur = 0,
      traffic = 0,
      url,
    } = formVals;
    const finalCategories = categories?.map((one: any) => one?.value);
    const stats = {
      da,
      pa,
      dr,
      ur,
      traffic,
    };
    const paramsValue = {
      title,
      categories: finalCategories,
      image,
      linkType: linkType?.value,
      timeline: timeline?.value,
      price,
      stats,
      url,
    };
    const mutationToCall = id && id !== true ? updatePublication : createPublication;
    mutationToCall({
      variables: {
        params:
          id && id !== true
            ? {
                id,
                ...paramsValue,
              }
            : paramsValue,
      },
    })
      .then(() => {
        setLoading(false);
        refetch();
        toast.success("Saved Successfully");
        onClose();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.message);
      });
  };
  useEffect(() => {
    if (data?.getPublicationById) {
      const {
        title,
        url,
        categories,
        linkType,
        price,
        timeline,
        image,
        stats = {},
      } = data.getPublicationById;
      const timelineObj = TimelineOptions?.find((el) => el?.value === timeline);
      const linkTypeObj = LinkTypeOptions?.find((el) => el?.value === linkType);
      const categoriesSaved = CategoryOptions?.filter((el) => categories?.includes(el?.value));
      const { dr, ur, da, pa, traffic } = stats;
      reset({
        title,
        url,
        categories: categoriesSaved,
        linkType: linkTypeObj?.label,
        price,
        timeline: timelineObj?.label,
        image,
        dr,
        ur,
        da,
        pa,
        traffic,
      });
    }
  }, [data]);
  return (
    <MDBox p={2}>
      <MDBox display="flex" alignItems="center">
        <IconButton onClick={onClose}>
          <ArrowBackIosIcon />
        </IconButton>
        <MDTypography variant="h5">Create Publication</MDTypography>
      </MDBox>
      {loading || (fetchLoading && <MDCircularLoader overlayloader startLoader />)}
      <MDBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type="text"
              label="Title"
              name="title"
              control={control}
              variant="outlined"
              disabled={disabled}
              errors={errors}
              rules={genericValidations.text}
            />
            <FormField
              type="multiSelect"
              placeholder="Categories"
              label="Categories"
              name="categories"
              control={control}
              options={CategoryOptions}
              variant="outlined"
              disabled={disabled}
              errors={errors}
              rules={genericValidations.dropdown}
            />
            <FormField
              type="number"
              label="Traffic"
              name="traffic"
              control={control}
              variant="outlined"
              disabled={disabled}
            />
            <FormField
              type="number"
              label="DA"
              name="da"
              control={control}
              variant="outlined"
              disabled={disabled}
            />
            <FormField
              type="number"
              label="PA"
              name="pa"
              control={control}
              variant="outlined"
              disabled={disabled}
            />

            <FormField
              type="dropdown"
              placeholder="Timeline"
              label="Timeline"
              name="timeline"
              control={control}
              options={TimelineOptions}
              variant="outlined"
              disabled={disabled}
              errors={errors}
              rules={genericValidations.dropdown}
            />
            <FormField
              type="text"
              label="URL"
              name="url"
              control={control}
              variant="outlined"
              disabled={disabled}
              errors={errors}
              rules={genericValidations.url}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type="file"
              subLabel="JPEG, PNG, JPG(max. 3MB)"
              name="image"
              label="Image"
              control={control}
              defaultValue={data?.getPublicationById?.image}
              disabled={disabled}
              errors={errors}
              rules={genericValidations.text}
            />
            <FormField
              type="number"
              label="DR"
              name="dr"
              control={control}
              variant="outlined"
              disabled={disabled}
            />
            <FormField
              type="number"
              label="UR"
              name="ur"
              control={control}
              variant="outlined"
              disabled={disabled}
            />
            <FormField
              type="dropdown"
              placeholder="Link Type"
              label="Link Type"
              name="linkType"
              control={control}
              options={[
                { label: "Do Follow", value: "DO_FOLLOW" },
                { label: "No Follow", value: "NO_FOLLOW" },
              ]}
              variant="outlined"
              disabled={disabled}
              errors={errors}
              rules={genericValidations.dropdown}
            />
            <FormField
              type="number"
              label="Price"
              name="price"
              errors={errors}
              rules={genericValidations.number}
              control={control}
              variant="outlined"
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </MDBox>
      <Divider
        sx={{
          borderColor: "rgba(0, 0, 0, 0.12)",
          borderStyle: "dotted",
        }}
      />
      <MDBox display="flex" alignItems="center" justifyContent="space-between">
        <MDButton color="white" variant="contained" onClick={onClose}>
          Cancel
        </MDButton>
        <MDButton color="primary" variant="contained" onClick={handleSubmit(onSubmit)}>
          Submit
        </MDButton>
      </MDBox>
    </MDBox>
  );
};
export default PublicationForm;

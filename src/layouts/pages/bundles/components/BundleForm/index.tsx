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
import { GET_BUNDLE_BY_ID, IGetBundleByIdVars } from "graphql/queries/getBundleById";
import {
  GET_PUBLICATIONS,
  IGetPublications,
  IGetPublicationsVars,
} from "graphql/queries/filterPublicationsPaginated";
import { CREATE_BUNDLE, ICreateBundleVars } from "graphql/mutations/createBundle";
import { UPDATE_BUNDLE, IUpdateBundleVars } from "graphql/mutations/updateBundle";
import { genericValidations } from "utils/helpers";
import { BundleCategoryOptions, BundleTypeOptions } from "constants/index";
import ComplexProjectCard from "layouts/pages/releases/components/ComplexProjectCard";

const BundleForm = ({
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
      category: null,
      type: null,
      price: null,
    },
  });

  const [createBundle] = useMutation<ICreateBundleVars>(CREATE_BUNDLE);
  const [updateBundle] = useMutation<IUpdateBundleVars>(UPDATE_BUNDLE);
  const { data, loading: fetchLoading } = useQuery<IGetBundleByIdVars>(GET_BUNDLE_BY_ID, {
    variables: {
      id,
    },
    fetchPolicy: "network-only",
    skip: !id || id === true,
  });
  const { data: publicationsData, loading: pLoader } = useQuery<
    IGetPublications,
    IGetPublicationsVars
  >(GET_PUBLICATIONS, {
    variables: {
      filterInput: {},
      paginationInput: {
        currentPage: 0,
        perPage: 200,
      },
    },
    skip: disabled,
  });

  const [publicationIds, setPublicationIds] = useState<any>([]);

  const onSubmit = async (formVals: any) => {
    if (!isDirty && publicationIds === data?.getBundleById?.publicationIds) {
      toast.info("Nothing to save");
      return;
    }
    setLoading(true);
    const paramsValue = {
      type: formVals?.type?.value,
      category: formVals?.category?.value,
      publicationIds,
      price: formVals?.price,
    };
    const mutationToCall = id && id !== true ? updateBundle : createBundle;
    mutationToCall({
      variables: {
        params:
          id && id !== true
            ? {
                id,
                ...paramsValue,
              }
            : { ...paramsValue },
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
    if (data?.getBundleById) {
      const { category, type, price, publicationIds } = data.getBundleById;
      const typeObj = BundleTypeOptions?.find((el) => el?.value === type);
      const categoryObj = BundleCategoryOptions?.find((el) => el?.value === category);
      reset({
        category: categoryObj?.label,
        type: typeObj?.label,
        price,
      });
      setPublicationIds(publicationIds);
    }
  }, [data]);
  const currentPublications: any = publicationsData?.filterPublicationsPaginated?.data || [];
  const handlePublicationClick = (id: any) => {
    if (publicationIds?.indexOf(id) !== -1) {
      const newIds = publicationIds?.filter((one: any) => one !== id);
      setPublicationIds(newIds);
    } else {
      setPublicationIds((oldVal: any) => [...oldVal, id]);
    }
  };
  return (
    <MDBox p={2}>
      <MDBox display="flex" alignItems="center">
        <IconButton onClick={onClose}>
          <ArrowBackIosIcon />
        </IconButton>
        <MDTypography variant="h5">Create Bundle</MDTypography>
      </MDBox>
      {(loading || pLoader || fetchLoading) && <MDCircularLoader overlayloader startLoader />}
      <MDBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <FormField
              type="dropdown"
              placeholder="Bundle Category"
              label="Category"
              name="category"
              control={control}
              options={BundleCategoryOptions}
              variant="outlined"
              disabled={disabled}
              errors={errors}
              rules={genericValidations.dropdown}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type="dropdown"
              placeholder="Bundle Type"
              label="Type"
              name="type"
              control={control}
              options={BundleTypeOptions}
              variant="outlined"
              disabled={disabled}
              errors={errors}
              rules={genericValidations.dropdown}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
      <MDBox mt={5}>
        <MDTypography variant="h5">Publications</MDTypography>
        <Grid container spacing={3}>
          {currentPublications?.map((one: any, i: number) => {
            return (
              <Grid key={i} item xs={12} md={6} lg={6}>
                <MDBox my={1.5} variant="gradient">
                  <ComplexProjectCard
                    image={one?.image}
                    title={one?.title}
                    description="If everything I did failed - which it doesn't, I think that it actually succeeds."
                    dateTime="02.03.22"
                    stats={[
                      { title: "DA", value: one?.stats?.da },
                      { title: "DR", value: one?.stats?.dr },
                      { title: "PA", value: one?.stats?.pa },
                      { title: "UR", value: one?.stats?.ur },
                    ]}
                    traffic={one?.stats?.traffic}
                    linkType={one?.linkType?.split("_")?.join(" ")}
                    timeLine={
                      (one?.timeline &&
                        (one?.timeline === "W1"
                          ? "WITHIN ONE WEEK"
                          : one?.timeline === "W2"
                          ? "WITHIN TWO WEEKS"
                          : one?.timeline === "D1"
                          ? "WITHIN ONE DAY"
                          : one?.timeline === "D2"
                          ? "WITHIN TWO DAYS"
                          : one?.timeline === "D5"
                          ? "WITHIN FIVE DAYS"
                          : `WITHIN ${one?.timeline}`)) ||
                      ""
                    }
                    credits={one?.price}
                    categories={one?.categories?.join(" / ")}
                    onClick={disabled ? () => {} : handlePublicationClick}
                    selected={publicationIds?.length && publicationIds?.indexOf(one?.id) !== -1}
                    id={one?.id}
                  />
                </MDBox>
              </Grid>
            );
          })}
        </Grid>
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
        <MDButton color="primary" variant="contained" onClick={handleSubmit(onSubmit)}>
          Submit
        </MDButton>
      </MDBox>
    </MDBox>
  );
};
export default BundleForm;

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// @mui material components
import Grid from "@mui/material/Grid";
import InfoIcon from "@mui/icons-material/Info";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import MDButton from "components/MDButton";
import { useForm } from "react-hook-form";
import EditorialGuidelines from "../EditorialGuidelines";

// NewProduct page components
import FormField from "../FormField";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ARTICLE, ICreateArticleVars } from "graphql/mutations/createArticle";
import { UPDATE_ARTICLE, IUpdateArticleVars } from "graphql/mutations/updateArticle";
import { GET_CLIENTS, IGetClientsVars, IGetClients } from "graphql/queries/filterClientsPaginated";

interface Props {
  cb?: any;
  saveData?: boolean;
  data?: any;
  refetch?: () => void;
  disabled?: any;
}

function AddPress({ cb, saveData, data = {}, refetch, disabled = false }: Props): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const { title, content, summary, featureImage, featureImageDesc } = data;
  const {
    control,
    formState: { isDirty },
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: { clientId: null, title, content, summary, featureImage, featureImageDesc },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [createArticle] = useMutation<ICreateArticleVars>(CREATE_ARTICLE);
  const [updateArticle] = useMutation<IUpdateArticleVars>(UPDATE_ARTICLE);
  const { data: clientsData } = useQuery<IGetClients, IGetClientsVars>(GET_CLIENTS, {
    variables: {
      filterInput: {},
      paginationInput: {
        currentPage: 0,
        perPage: 200,
      },
    },
  });
  const clientsObj: any = clientsData?.filterClientsPaginated?.data?.map((el) => ({
    label: el?.title,
    value: el?.id,
  }));

  const onSubmit = async (formVals: any) => {
    const { clientId = {} } = formVals || {};
    setLoading(true);
    try {
      let res: any;
      if (data?.id) {
        res = await updateArticle({
          variables: {
            params: {
              id: data.id,
              ...formVals,
              clientId: clientId?.value,
            },
          },
        });
      } else {
        res = await createArticle({
          variables: {
            params: {
              ...formVals,
              clientId: clientId?.value,
            },
          },
        });
      }
      setLoading(false);
      toast.success("Saved Successfully");
      if (refetch) refetch();
      const resId = res?.data?.updateArticle?.id || res?.data?.createArticle?.id;
      cb(resId);
    } catch (err: any) {
      setLoading(false);
      console.error("Error in saving data:", err);
      toast.error(err?.message);
    }
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
      const { clientId } = data;
      const clientObj = clientsData?.filterClientsPaginated?.data?.find(
        (el) => el?.id === clientId
      );
      reset({ clientId: clientObj?.title });
    }
  }, [data, clientsData]);
  return (
    <MDBox>
      {loading && <MDCircularLoader overlayloader startLoader />}
      {open && <EditorialGuidelines onClose={() => setOpen(false)} />}
      <MDTypography variant="h5">Product Information</MDTypography>
      <MDBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={7}>
            <FormField
              type="dropdown"
              placeholder="Select Client"
              label="Client"
              name="clientId"
              control={control}
              options={clientsObj}
              variant="outlined"
              disabled={disabled}
            />

            <FormField
              type="text"
              label="Title"
              name="title"
              control={control}
              variant="outlined"
              disabled={disabled}
            />
            <FormField
              type="text"
              label="Summary"
              name="summary"
              control={control}
              multiline
              rows={4}
              variant="outlined"
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormField
              type="file"
              subLabel="JPEG, PNG, JPG(max. 3MB)"
              name="featureImage"
              label="Feature Image"
              control={control}
              defaultValue={data?.featureImage}
              disabled={disabled}
            />
            <FormField
              type="text"
              placeholder="Image Description"
              name="featureImageDesc"
              control={control}
              variant="outlined"
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </MDBox>
      <MDBox mt={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <MDBox sx={{ mb: "0.5rem" }} display="flex" alignItems="center">
              <MDTypography
                component="label"
                fontSize="1rem"
                fontWeight="medium"
                color="textSecondary"
              >
                Press Release Content
              </MDTypography>
              <MDButton
                startIcon={<InfoIcon />}
                sx={{ ml: 1, borderRadius: "32px", height: "34px" }}
                color="info"
                onClick={() => setOpen(true)}
              >
                <MDTypography
                  fontSize="14px"
                  sx={{ fontWeight: 400, color: "rgba(255, 255, 255, 1)" }}
                >
                  Editorial Guidelines
                </MDTypography>
              </MDButton>
            </MDBox>
            <FormField
              type="editor"
              name="content"
              control={control}
              label=""
              multiline
              rows={4}
              variant="outlined"
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default AddPress;

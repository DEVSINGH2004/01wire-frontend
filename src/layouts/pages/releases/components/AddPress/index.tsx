import { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCircularLoader from "components/MDCircularLoader";
import MDSnackbar from "components/MDSnackbar";
import { useForm } from "react-hook-form";

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
}

function AddPress({ cb, saveData, data = {}, refetch }: Props): JSX.Element {
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
      <MDSnackbar color="success" icon="check" title="Saved Successfully" open />;
      if (refetch) refetch();
      const resId = res?.data?.updateArticle?.id || res?.data?.createArticle?.id;
      cb(resId);
    } catch (err) {
      console.error("Error in saving data:", err);
      setLoading(false);
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
            />

            <FormField
              type="text"
              label="Title"
              name="title"
              control={control}
              variant="outlined"
            />
            <FormField
              type="text"
              label="Summary"
              name="summary"
              control={control}
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormField
              type="file"
              subLabel="SVG, PNG, JPG(max. 3MB)"
              name="featureImage"
              label="Feature Image"
              control={control}
              defaultValue={data?.featureImage}
            />
            <FormField
              type="text"
              placeholder="Image Description"
              name="featureImageDesc"
              control={control}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </MDBox>
      <MDBox mt={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <FormField
              type="editor"
              name="content"
              control={control}
              label="Press Release Content"
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default AddPress;

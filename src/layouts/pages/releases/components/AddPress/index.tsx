import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// @mui material components
import Grid from "@mui/material/Grid";
import InfoIcon from "@mui/icons-material/Info";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDCircularLoader from "components/MDCircularLoader";
import CircularProgress from "@mui/material/CircularProgress";
import MDButton from "components/MDButton";
import Autocomplete from "@mui/material/Autocomplete";
import FormHelperText from "@mui/material/FormHelperText";

import { useForm } from "react-hook-form";
import EditorialGuidelines from "../EditorialGuidelines";

// NewProduct page components
import FormField from "../FormField";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_ARTICLE, ICreateArticleVars } from "graphql/mutations/createArticle";
import { UPDATE_ARTICLE, IUpdateArticleVars } from "graphql/mutations/updateArticle";
import { GET_CLIENTS, IGetClientsVars, IGetClients } from "graphql/queries/filterClientsPaginated";
import { genericValidations } from "utils/helpers";
import { MAX_IMAGE_SIZE_MB } from "constants/index";

interface Props {
  cb?: any;
  saveData?: boolean;
  data?: any;
  refetch?: () => void;
  disabled?: any;
  setSaveData?: any;
}

function AddPress({
  cb,
  saveData,
  data = {},
  refetch,
  disabled = false,
  setSaveData,
}: Props): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [openAutocomplete, setOpenAutocomplete] = useState<boolean>(false);
  const [showClientErr, setShowClientErr] = useState<boolean>(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { title, content, summary, featureImage, featureImageDesc, createdAt } = data || {};
  const {
    control,
    formState: { isDirty, errors },
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      clientId: null,
      title,
      content: content && `<div>${content}</div>`,
      summary,
      featureImage,
      featureImageDesc,
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedClient, setClient] = useState<any>(null);
  const [createArticle] = useMutation<ICreateArticleVars>(CREATE_ARTICLE);
  const [updateArticle] = useMutation<IUpdateArticleVars>(UPDATE_ARTICLE);
  const [fetchOptions, { data: clientsResult, loading: optionsLoading }] = useLazyQuery<
    IGetClients,
    IGetClientsVars
  >(GET_CLIENTS);
  // Derived from the query result (replaces the deprecated onCompleted option)
  useEffect(() => {
    if (!clientsResult) return;
    const clientsObj: any = clientsResult?.filterClientsPaginated?.data?.map((el: any) => ({
      label: el?.title,
      value: el?.id,
    }));
    setOptions(clientsObj);
  }, [clientsResult]);
  const onSubmit = async (formVals: any) => {
    setLoading(true);
    try {
      let res: any;
      if (data?.id) {
        res = await updateArticle({
          variables: {
            params: {
              id: data.id,
              ...formVals,
              clientId: selectedClient?.value,
            },
          },
        });
      } else {
        const { createdAt, ...articleParams } = formVals;
        res = await createArticle({
          variables: {
            params: {
              ...articleParams  ,
              clientId: selectedClient?.value,
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
      setSaveData(false);
    }
  };
  useEffect(() => {
    // Read-only PRs can still report isDirty after load; never save them
    if (saveData && isDirty && !disabled) {
      if (!selectedClient) {
        setShowClientErr(true);
      }
      handleSubmit(onSubmit)();
    } else if (saveData) {
      cb();
    }
  }, [saveData, isDirty]);

  useEffect(() => {
    if (data?.id) {
      const { clientInfo } = data;
      if (clientInfo) {
        setClient({
          label: clientInfo?.title,
          value: clientInfo?.id,
        });
      }
    }
  }, [data]);
  useEffect(() => {
    if (Object.keys(errors).length) {
      setSaveData(false);
    }
  }, [Object.keys(errors).length]);
  useEffect(() => {
    if (inputValue) {
      fetchOptions({
        variables: {
          filterInput: {
            title: inputValue,
          },
          paginationInput: {
            currentPage: 0,
            perPage: 6,
          },
        },
      });
    }
  }, [inputValue]);
  const handleInputChange = (event: any, value: any) => {
    setInputValue(value);
  };
  return (
    <MDBox>
      {loading && <MDCircularLoader overlayloader startLoader />}
      {open && <EditorialGuidelines onClose={() => setOpen(false)} />}
      <MDTypography variant="h5">Product Information</MDTypography>
      <MDBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={7}>
            <MDBox>
              <MDTypography
                component="label"
                sx={{ mb: "0.5rem" }}
                fontSize="1rem"
                fontWeight="medium"
                color="textSecondary"
              >
                Client
              </MDTypography>
              <Autocomplete
                open={openAutocomplete}
                onOpen={() => setOpenAutocomplete(true)}
                onClose={() => setOpenAutocomplete(false)}
                onInputChange={handleInputChange}
                inputValue={inputValue}
                onChange={(event, newValue) => {
                  setClient(newValue);
                }}
                disabled={disabled}
                value={selectedClient}
                options={options}
                getOptionLabel={(option: any) => option?.label}
                loading={optionsLoading}
                renderInput={(params) => (
                  <MDInput
                    {...params}
                    variant="outlined"
                    sx={{
                      height: "42px",
                      "& .MuiInputBase-root": {
                        height: "42px",
                      },
                    }}
                    placeholder="Search Client"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {optionsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {!selectedClient && showClientErr && (
                <FormHelperText error={true}>Please fill value</FormHelperText>
              )}
            </MDBox>
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
              type="text"
              label="Summary"
              name="summary"
              control={control}
              multiline
              variant="outlined"
              disabled={disabled}
              rows={!disabled && 4}
              errors={errors}
              rules={genericValidations.text}
            />
            {/* <FormField
              label="Created At"
              type="date"
              name="createdAt"
              control={control}
              disabled={disabled}
            /> */}
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormField
              type="file"
              subLabel={`JPEG, PNG, JPG (max. ${MAX_IMAGE_SIZE_MB}MB)`}
              name="featureImage"
              label="Feature Image (1280x720 pixels or 16:9)"
              control={control}
              defaultValue={data?.featureImage}
              disabled={disabled}
              errors={errors}
              rules={genericValidations.text}
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
                color="primary"
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
              errors={errors}
              rules={genericValidations.text}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default AddPress;

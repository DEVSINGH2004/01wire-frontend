import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
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
import { Chip } from "@mui/material";
import PublicationsList from "layouts/pages/releases/components/PublicationsList";
import MDInput from "components/MDInput";
import SearchIcon from "assets/images/icons/searchIcon.svg";
import InputAdornment from "@mui/material/InputAdornment";
import BundlePublicationModal from "layouts/pages/releases/components/BundlePublicationModal";

const perPage = 10;
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
  const [selecetdP, setSelectedP] = useState<any>([]);
  const [currentPage, setPage] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPublications, setFilteredPublications] = useState(null);
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
      image: null,
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
        currentPage: currentPage,
        perPage: perPage,
      },
    },
    fetchPolicy: "network-only",
    skip: disabled,
  });

  const [publicationIds, setPublicationIds] = useState<any>([]);
  const [open, setOpen] = useState<any>(false);

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
      image: formVals?.image,
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
      const { category, type, price, publicationIds, image, publicationInfo } = data.getBundleById;
      const typeObj = BundleTypeOptions?.find((el) => el?.value === type);
      const categoryObj = BundleCategoryOptions?.find((el) => el?.value === category);
      reset({
        category: categoryObj?.label,
        type: typeObj?.label,
        price,
        image,
      });
      setPublicationIds(publicationIds);
      setSelectedP(publicationInfo);
    }
  }, [data]);
  const currentPublications: any = publicationsData?.filterPublicationsPaginated?.data || [];
  const handleSelectedRowsChange = (newSelectedRows: any[]) => {
    setSelectedP(newSelectedRows);
    const ids = newSelectedRows?.length > 0 ? newSelectedRows.map((item: any) => item.id) : [];
    setPublicationIds(ids);
  };
  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    const filteredItems = currentPublications.filter((item: any) =>
      item?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPublications(filteredItems);
  }, [searchTerm]);
  return (
    <>
      <MDBox p={2}>
        <MDBox display="flex" alignItems="center">
          <IconButton onClick={onClose}>
            <ArrowBackIosIcon />
          </IconButton>
          <MDTypography variant="h5">
            {id && id !== true ? "Edit Bundle" : "Create Bundle"}
          </MDTypography>
        </MDBox>
        {(loading || pLoader || fetchLoading) && <MDCircularLoader overlayloader startLoader />}
        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
              <FormField
                type="dropdown"
                placeholder="Enter Title"
                label="Bundle Category"
                name="category"
                control={control}
                options={BundleCategoryOptions}
                variant="outlined"
                disabled={disabled}
                errors={errors}
                rules={genericValidations.dropdown}
              />
              <FormField
                type="dropdown"
                placeholder="Bundle Type"
                label="Bundle Type"
                name="type"
                control={control}
                options={BundleTypeOptions}
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
            <Grid item xs={12} sm={5}>
              <FormField
                type="file"
                subLabel="JPEG, PNG, JPG(max. 3MB)"
                name="image"
                label="Image"
                control={control}
                defaultValue={data?.featureImage}
                disabled={disabled}
                errors={errors}
                rules={genericValidations.text}
              />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={5}>
          {((disabled && currentPublications?.length > 0) || !disabled) && (
            <MDBox>
              <MDBox py={2} display="flex" justifyContent="space-between">
                <MDBox display="flex" alignItems="center">
                  <MDTypography variant="h6">
                    {disabled ? "Selected Publications" : "Select Publications"}
                  </MDTypography>
                  <Chip
                    sx={{ ml: 2, cursor: "pointer" }}
                    color="primary"
                    variant="outlined"
                    label={`${publicationIds?.length} Selected`}
                    onClick={() => setOpen(true)}
                  />
                </MDBox>
                <MDBox width="250px" ml="auto">
                  <MDInput
                    placeholder="Search Bundles..."
                    size="small"
                    fullWidth
                    onChange={handleSearchChange}
                    value={searchTerm}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img height={15} width={15} src={SearchIcon} alt="Search" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </MDBox>
              </MDBox>
              <MDBox mt={3}>
                <PublicationsList
                  publications={searchTerm ? filteredPublications : currentPublications}
                  updatePage={setPage}
                  paginationInfo={publicationsData?.filterPublicationsPaginated?.paginationInfo}
                  onSelect={!disabled && handleSelectedRowsChange}
                  selectedP={selecetdP}
                  loading={pLoader}
                  disabled={disabled}
                />
              </MDBox>
            </MDBox>
          )}
        </MDBox>
      </MDBox>
      <MDBox
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="102.47%"
        bgColor="white"
        sx={{
          position: "sticky",
          bottom: 0,
          marginLeft: "-1.2%",
          padding: "2rem 1rem",
          boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
        }}
      >
        <MDButton color="light" sx={{ color: "#000" }} variant="contained" onClick={onClose}>
          Cancel
        </MDButton>
        <MDButton color="primary" variant="contained" onClick={handleSubmit(onSubmit)}>
          Submit
        </MDButton>
      </MDBox>
      {open && (
        <BundlePublicationModal onClose={() => setOpen(false)} currentPublications={selecetdP} />
      )}
    </>
  );
};
export default BundleForm;

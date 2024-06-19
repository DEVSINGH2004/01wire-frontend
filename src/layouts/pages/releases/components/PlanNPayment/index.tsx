import { useState, useEffect } from "react";
import { toast } from "react-toastify";
// @mui material components
import Chip from "@mui/material/Chip";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// import MDInput from "components/MDInput";
import MDCircularLoader from "components/MDCircularLoader";
import { useMutation, useQuery } from "@apollo/client";
import { GET_BUNDLES, IGetBundles, IGetBundlesVars } from "graphql/queries/filterBundlesPaginated";
import {
  GET_PUBLICATIONS,
  IGetPublications,
  IGetPublicationsVars,
} from "graphql/queries/filterPublicationsPaginated";
import { UPDATE_ARTICLE, IUpdateArticleVars } from "graphql/mutations/updateArticle";
import DisplayBundles from "../DisplayBundles";
import PublicationsList from "../PublicationsList";

const perPage = 10;
interface Props {
  cb?: any;
  saveData?: boolean;
  data?: any;
  refetch?: () => void;
  disabled?: any;
  setSaveData?: any;
}
function PlanNPayment({
  data,
  cb,
  saveData,
  refetch,
  disabled = false,
  setSaveData,
}: Props): JSX.Element {
  const savedBundlePids =
    data?.bundleInfo?.length > 0
      ? [...new Set(data.bundleInfo?.flatMap((bundle: any) => bundle.publicationIds))]
      : [];

  const [updateArticle] = useMutation<IUpdateArticleVars>(UPDATE_ARTICLE);
  const [loading, setLoading] = useState<boolean>(false);
  const [publicationIds, setPublicationIds] = useState<any>(
    data?.publicationIds ? data?.publicationIds : []
  );
  const [selecetdP, setSelectedP] = useState<any>(data?.publicationInfo || []);
  const [selected, setSelected] = useState<any>(data?.bundleInfo || []);
  const [bundlePids, setBundlePids] = useState<any>(savedBundlePids);
  const [selectedCategory, setCategory] = useState<string | null>();
  const [currentPage, setPage] = useState<number>(0);

  const { data: bundlesData } = useQuery<IGetBundles, IGetBundlesVars>(GET_BUNDLES, {
    variables: {
      paginationInput: {
        currentPage: 0,
        perPage: 200,
      },
    },
    skip: disabled,
  });
  console.log("bundleData",bundlesData)
  const {
    data: publicationsData,
    refetch: refetchPublications,
    loading: pLoading,
  } = useQuery<IGetPublications, IGetPublicationsVars>(GET_PUBLICATIONS, {
    variables: {
      filterInput: {
        filterIds: bundlePids,
      },
      paginationInput: {
        currentPage: currentPage,
        perPage: perPage,
      },
    },
    skip: disabled,
  });
  const currentPublications: any =
    (disabled && data?.publicationInfo) ||
    publicationsData?.filterPublicationsPaginated?.data ||
    [];
  const handleChange = (category: any, bundle: any) => {
    const { id, publicationIds } = bundle;
    setSelected((prevBundles: any) => {
      // Filter out bundles of the same category
      const updatedBundles = prevBundles.filter((b: any) => b.category !== category);

      // If bundle is already selected, remove it
      if (prevBundles?.some((b: any) => b.id === id)) {
        return updatedBundles;
      }

      // Add the new bundle for the category
      return [...updatedBundles, { ...bundle, category }];
    });
    setBundlePids((prevPublications: any) => {
      // If bundle is already selected, remove its publication IDs
      if (selected?.some((b: any) => b.id === id)) {
        return prevPublications.filter((pubId: any) => !publicationIds.includes(pubId));
      }
      // Add the new publication IDs
      return [...prevPublications, ...publicationIds];
    });
  };
  const handleSelectedRowsChange = (newSelectedRows: any[]) => {
    setSelectedP(newSelectedRows);
    const ids = newSelectedRows?.length > 0 ? newSelectedRows.map((item: any) => item.id) : [];
    setPublicationIds(ids);
  };
  const onSubmit = () => {
    const selectedBundleIds = selected?.map((bundle: any) => bundle.id);
    if (
      JSON.stringify(selectedBundleIds) !== JSON.stringify(data?.bundleIds) ||
      JSON.stringify(publicationIds) !== JSON.stringify(data?.publicationIds)
    ) {
      setLoading(true);
      updateArticle({
        variables: {
          params: {
            id: data?.id,
            bundleIds: selectedBundleIds || [],
            publicationIds: publicationIds || [],
          },
        },
      })
        .then((res: any) => {
          setLoading(false);
          toast.success("Saved Successfully");
          if (refetch) refetch();
          const resId = res?.data?.updateArticle?.id;
          cb(resId);
        })
        .catch((err: any) => {
          setLoading(false);
          toast.error(err?.message);
          console.log("error in saving data", err);
          setSaveData(false);
        });
    } else {
      cb();
    }
  };
  useEffect(() => {
    if (saveData) {
      onSubmit();
    }
  }, [saveData]);
  useEffect(() => {
    refetchPublications();
  }, [currentPage, refetchPublications]);
  const groupedData: any = bundlesData?.filterBundlesPaginated?.data?.reduce(
    (acc: any, obj: any) => {
      const { category, ...rest } = obj;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(rest);
      return acc;
    },
    {}
  );
  const handleCategorySelection = (value: string) => {
    setCategory(value);
  };
  useEffect(() => {
    if (!selectedCategory && bundlesData?.filterBundlesPaginated?.data?.length) {
      setCategory(bundlesData?.filterBundlesPaginated?.data?.[0]?.category);
    }
  }, [bundlesData]);
  return (
    <MDBox>
      {loading && <MDCircularLoader overlayloader startLoader />}
      {!disabled && groupedData && (
        <MDBox
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {Object.keys(groupedData)?.map((category: any, i: number) => {
            return (
              <Chip
                key={i}
                label={category}
                color={selectedCategory === category ? "primary" : "default"}
                variant={selectedCategory === category ? "filled" : "outlined"}
                onClick={() => handleCategorySelection(category)}
              />
            );
          })}
        </MDBox>
      )}
      {(groupedData || (disabled && data?.bundleInfo?.length > 0)) && (
        <MDBox mt={3}>
          <MDTypography variant="h6">
            {disabled ? "Selected Bundle" : "Select Bundles"}
          </MDTypography>
          <DisplayBundles
            bundles={disabled ? data.bundleInfo : groupedData[selectedCategory]}
            handleChange={handleChange}
            selected={selected}
            disabled={disabled}
            category={selectedCategory}
          />
        </MDBox>
      )}

      {((disabled && currentPublications?.length > 0) || !disabled) && (
        <MDBox>
          <MDBox py={2} display="flex" justifyContent="space-between">
            <MDBox display="flex" alignItems="center">
              <MDTypography variant="h6">
                {disabled ? "Selected Publications" : "Select Publications"}
              </MDTypography>
              <Chip
                sx={{ ml: 2 }}
                color="primary"
                variant="outlined"
                label={`${publicationIds?.length} Selected`}
              />
            </MDBox>
            {/* <MDBox width="173px" ml="auto">
                <MDInput
                  placeholder="Search..."
                  size="small"
                  fullWidth
                  onChange={({ currentTarget }: any) => {
                    setSearch(search);
                    onSearchChange(currentTarget.value);
                  }}
                />
              </MDBox> */}
          </MDBox>
          <MDBox mt={3}>
            <PublicationsList
              publications={currentPublications}
              updatePage={setPage}
              paginationInfo={publicationsData?.filterPublicationsPaginated?.paginationInfo}
              onSelect={!disabled && handleSelectedRowsChange}
              selectedP={selecetdP}
              loading={pLoading}
              disabled={disabled}
            />
          </MDBox>
        </MDBox>
      )}
    </MDBox>
  );
}

export default PlanNPayment;

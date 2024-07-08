import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
// @mui material components
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
// import MDInput from "components/MDInput";
import MDCircularLoader from "components/MDCircularLoader";
import MDInput from "components/MDInput";
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
import SearchIcon from "assets/images/icons/searchIcon.svg";
import BundlePublicationModal from "../BundlePublicationModal";
import debounce from "lodash.debounce";

const perPage = 10;
interface Props {
  cb?: any;
  saveData?: boolean;
  data?: any;
  refetch?: () => void;
  disabled?: any;
  setSaveData?: any;
  createEstimate?: any;
  setPayable?: any;
}
function PlanNPayment({
  data,
  cb,
  saveData,
  refetch,
  disabled = false,
  setSaveData,
  createEstimate = false,
  setPayable,
}: Props): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const estimation = location?.state?.estimation || {};
  const estimatePIds = estimation?.selectedPublications?.map((p: any) => p?.id);
  const savedBundlePids =
    data?.bundleInfo?.length > 0
      ? [...new Set(data.bundleInfo?.flatMap((bundle: any) => bundle.publicationIds))]
      : [];
  const [updateArticle] = useMutation<IUpdateArticleVars>(UPDATE_ARTICLE);
  const [loading, setLoading] = useState<boolean>(false);
  const [publicationIds, setPublicationIds] = useState<any>(
    estimatePIds || (data?.publicationIds ? data?.publicationIds : [])
  );
  const [totalCredits, setCredits] = useState<number>(0);
  const [selectedP, setSelectedP] = useState<any>(
    estimation?.selectedPublications || data?.publicationInfo || []
  );
  const [selected, setSelected] = useState<any>(
    estimation?.selectedBundles || data?.bundleInfo || []
  );
  const [bundlePids, setBundlePids] = useState<any>(savedBundlePids);
  const [selectedCategory, setCategory] = useState<string | null>();
  const [currentPage, setPage] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState<any>(false);
  const [pageSize, setSize] = useState<number>(50);
  const [filter, setFilter] = useState<any>({});

  const { data: bundlesData } = useQuery<IGetBundles, IGetBundlesVars>(GET_BUNDLES, {
    variables: {
      paginationInput: {
        currentPage: 0,
        perPage: 200,
      },
    },
    fetchPolicy: "network-only",
    skip: disabled,
  });
  const {
    data: publicationsData,
    refetch: refetchPublications,
    loading: pLoading,
  } = useQuery<IGetPublications, IGetPublicationsVars>(GET_PUBLICATIONS, {
    variables: {
      filterInput: {
        filterIds: bundlePids,
        ...filter,
      },
      paginationInput: {
        currentPage: currentPage,
        perPage: pageSize,
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
  const checkTitleAvail = useCallback(
    debounce((val: string) => {
      setFilter({ title: val });
    }, 500),
    []
  );
  const handleSearchChange = (event: any) => {
    const searchVal = event.target.value || "";
    setSearchTerm(searchVal);
    checkTitleAvail(searchVal);
  };
  useEffect(() => {
    if (!selectedCategory && bundlesData?.filterBundlesPaginated?.data?.length) {
      setCategory(bundlesData?.filterBundlesPaginated?.data?.[0]?.category);
    }
  }, [bundlesData]);

  function calculateTotalPrice(arr: any[]): number {
    return arr.reduce((total, one) => total + (one?.price || one?.credits || 0), 0);
  }
  useEffect(() => {
    const bCredits = calculateTotalPrice(selected);
    const pCredits = calculateTotalPrice(selectedP);
    setCredits(bCredits + pCredits);
  }, [selectedP, selected]);
  useEffect(() => {
    if (setPayable) {
      setPayable(totalCredits);
    }
  }, [totalCredits]);

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
                onClick={() => {
                  if (!disabled) setOpen(true);
                }}
              />
            </MDBox>
            {!disabled && (
              <MDInput
                sx={{ width: 268 }}
                fullWidth
                type="text"
                size="small"
                onChange={handleSearchChange}
                value={searchTerm}
                placeholder="Search Publications"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img height={15} width={15} src={SearchIcon} alt="Search" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </MDBox>
          <MDBox mt={3}>
            <PublicationsList
              publications={currentPublications}
              updatePage={setPage}
              paginationInfo={publicationsData?.filterPublicationsPaginated?.paginationInfo}
              onSelect={!disabled && handleSelectedRowsChange}
              selectedP={selectedP}
              loading={pLoading}
              disabled={disabled}
              entriesPerPage={
                disabled ? false : { defaultValue: pageSize, entries: [5, 10, 20, 40, 50] }
              }
              setSize={setSize}
              maxHeight
            />
          </MDBox>
        </MDBox>
      )}
      {createEstimate && (
        <MDBox
          width="102.47%"
          display="flex"
          justifyContent="space-between"
          bgColor="white"
          sx={{
            position: "sticky",
            bottom: 0,
            marginLeft: "-1.2%",
            padding: "2rem 1rem",
            boxShadow:
              "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
          }}
        >
          <MDBox>
            <MDTypography variant="h6">Estimated Amount in Credits</MDTypography>
            <MDTypography fontWeight="bold" fontSize="20px" color="primary">
              {totalCredits > 0 ? totalCredits : 0}
            </MDTypography>
          </MDBox>
          <MDBox>
            <MDButton
              variant="outlined"
              color="primary"
              sx={{ mr: 3 }}
              disabled={!selected?.length && !publicationIds?.length}
              onClick={() => {
                const selectedBundleIds = selected?.map((bundle: any) => bundle.id);
                createEstimate({
                  bundleIds: selectedBundleIds || [],
                  publicationIds: publicationIds || [],
                });
              }}
            >
              Save Estimate
            </MDButton>
            <MDButton
              color="primary"
              disabled={!selected?.length && !publicationIds?.length}
              onClick={() => {
                navigate("/releases", {
                  state: {
                    estimation: {
                      selectedBundles: selected,
                      selectedPublications: selectedP,
                    },
                  },
                });
              }}
            >
              Create PR
            </MDButton>
          </MDBox>
        </MDBox>
      )}
      {open && (
        <BundlePublicationModal onClose={() => setOpen(false)} currentPublications={selectedP} />
      )}
    </MDBox>
  );
}

export default PlanNPayment;

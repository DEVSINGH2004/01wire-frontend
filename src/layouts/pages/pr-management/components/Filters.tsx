import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useLazyQuery } from "@apollo/client";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControl from "@mui/material/FormControl";
import { statusOptions } from "./makeColumns";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import MDInput from "components/MDInput";
import InputAdornment from "@mui/material/InputAdornment";
import debounce from "lodash.debounce";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "assets/images/icons/searchIcon.svg";

import { IGetUsers, IGetUsersVars, GET_USERS } from "graphql/queries/filterUsersPaginated";

import EastIcon from "@mui/icons-material/East";
import dayjs, { Dayjs } from "dayjs";

const Filters = ({
  filters,
  setFilters,
  handleFilters,
  email,
  setEmail,
  setOptions,
  options,
}: {
  filters: any;
  handleFilters: any;
  email: string;
  setEmail: any;
  setOptions: any;
  options: any;
  setFilters: any;
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState<string>("");
  const [from, setFrom] = useState<Dayjs | null>(filters?.startTime || null);
  const [to, setTo] = useState<Dayjs | null>(filters?.endTime || null);

  const [getUsers, { data, loading, refetch }] = useLazyQuery<IGetUsers, IGetUsersVars>(GET_USERS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (to && from) {
      setFilters({
        ...filters,
        startTime: from,
        endTime: to,
      });
    }
  }, [to, from]);

  useEffect(() => {
    if (email) {
      getUsers({
        variables: {
          filterInput: {
            email: email,
          },
          paginationInput: {
            currentPage: 0,
            perPage: 6,
          },
        },
      });
    }
  }, [email]);

  useEffect(() => {
    const users = data?.filterUsersPaginated?.data;
    let options: any = [];
    if (users?.length) {
      options = users?.map((one) => {
        return {
          userId: one?.id,
          email: one?.email,
        };
      });
    }
    setOptions(options);
  }, [data]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const checkPrIdAvail = useCallback(
    debounce((val: string) => {
      handleFilters("prId", Number(val));
    }, 500),
    []
  );
  const handleInputChange = (evt: any) => {
    const searchTerm = evt.target.value || "";
    setQ(searchTerm);
    checkPrIdAvail(searchTerm);
  };

  const checkEmailAvail = useCallback(
    debounce((val: string) => {
      // handleFilters("prId", val);
    }, 500),
    []
  );
  const handleEmailChange = (evt: any) => {
    const searchTerm = evt.target.value || "";
    setEmail(searchTerm);
    checkEmailAvail(searchTerm);
  };

  const selectEmail = (event: any, values: any) => {
    console.log("userIds", values);

    handleFilters("userId", values?.userId);
  };

  console.log("userId", filters);

  return (
    <>
      <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Autocomplete
            id="asynchronous-demo"
            size="small"
            sx={{ width: 252, height: 42, mr: 2 }}
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            onChange={selectEmail}
            isOptionEqualToValue={(option, value) => option?.email === value?.email}
            getOptionLabel={(option: any) => option?.email}
            options={options}
            loading={loading}
            value={
              filters?.userId ? options?.find((el: any) => el.userId === filters?.userId) : null
            }
            renderInput={(params) => (
              <MDInput
                {...params}
                onChange={handleEmailChange}
                label=""
                value={filters?.userId ? filters?.userId : ""}
                sx={{
                  height: "42px",
                  "& .MuiInputBase-root": {
                    height: "42px",
                  },
                }}
                placeholder="Search By Email"
                // value={filters?.prId}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment sx={{ ml: "6px" }} position="start">
                      <img height={15} width={15} src={SearchIcon} alt="Search" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <MDInput
            sx={{ width: 252 }}
            fullWidth
            type="text"
            onChange={handleInputChange}
            value={q}
            placeholder="Search PR ID"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img height={15} width={15} src={SearchIcon} alt="Search" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="flex-end">
          <Box>
            <FormControl sx={{ width: "140px", height: "42px", mr: 2 }}>
              <Select
                id="demo-select-small"
                displayEmpty
                placeholder="Status"
                value={filters?.status}
                sx={{
                  textAlign: "center",
                  background: "#fff",
                  height: "42px",
                }}
                renderValue={
                  filters?.status !== "" ? undefined : () => <MDTypography>Status</MDTypography>
                }
                onChange={(e) => handleFilters("status", e.target.value)}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <MDBox
            borderRadius={"8px"}
            bgColor="white"
            sx={{
              height: "42px",
              width: "300px",
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space=between",
            }}
          >
            <Box>
              <MDTypography
                sx={{ fontWeight: "400", mt: "5px" }}
                fontSize="10px"
                color="textSecondary"
              >
                Start Date
              </MDTypography>
              <DatePicker
                value={from ? dayjs(from) : null}
                onChange={(newValue) => setFrom(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "standard",
                    sx: {
                      "& .MuiInput-underline:before": {
                        borderBottom: "none", // Remove bottom border when not focused
                      },
                      "& .MuiInput-underline:after": {
                        borderBottom: "none", // Remove bottom border when focused
                      },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "none", // Remove bottom border on hover (when not disabled)
                      },
                    },
                  },
                }}
                label=""
              />
            </Box>
            <Box mx={1}>
              <EastIcon fontSize="small" />
            </Box>
            <Box>
              <MDTypography
                sx={{ fontWeight: "400", mt: "5px" }}
                fontSize="10px"
                color="textSecondary"
              >
                To
              </MDTypography>
              <DatePicker
                value={to ? dayjs(to) : null}
                onChange={(newValue) => setTo(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "standard",
                    sx: {
                      "& .MuiInput-underline:before": {
                        borderBottom: "none", // Remove bottom border when not focused
                      },
                      "& .MuiInput-underline:after": {
                        borderBottom: "none", // Remove bottom border when focused
                      },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "none", // Remove bottom border on hover (when not disabled)
                      },
                    },
                  },
                }}
                label=""
              />
            </Box>
          </MDBox>
        </Box>
      </Box>
    </>
  );
};
export default Filters;

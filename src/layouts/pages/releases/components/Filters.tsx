import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useLazyQuery } from "@apollo/client";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControl from "@mui/material/FormControl";
import { statusOptions } from "../../pr-management/components/makeColumns";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import MDInput from "components/MDInput";
import InputAdornment from "@mui/material/InputAdornment";
import debounce from "lodash.debounce";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "assets/images/icons/searchIcon.svg";
import DownArrow from "assets/images/down-arrow.svg";
import { IGetUsers, IGetUsersVars, GET_USERS } from "graphql/queries/filterUsersPaginated";

import EastIcon from "@mui/icons-material/East";
import dayjs, { Dayjs } from "dayjs";

const Filters = ({
  filters,
  setFilters,
  handleFilters,
  clientsOptions,
}: {
  filters: any;
  handleFilters: any;
  clientsOptions: any;
  setFilters: any;
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState<string>("");
  const [from, setFrom] = useState<Dayjs | null>(filters?.startTime || null);
  const [to, setTo] = useState<Dayjs | null>(filters?.endTime || null);

  useEffect(() => {
    if (to && from) {
      setFilters({
        ...filters,
        startTime: from,
        endTime: to,
      });
    }
  }, [to, from]);

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

  const handleClientChange = (event: any, values: any) => {
    handleFilters("clientId", values?.clientId);
  };

  console.log("userId", filters);

  return (
    <>
      <Box pt={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Autocomplete
            id="asynchronous-demo"
            size="small"
            sx={{ width: 252, height: 42, mr: 2 }}
            onChange={handleClientChange}
            options={clientsOptions}
            value={
              filters?.clientId &&
              clientsOptions?.find((one: any) => one?.value === filters?.clientId)
            }
            renderInput={(params) => (
              <MDInput
                {...params}
                // onChange={handleClientChange}
                label=""
                // value={filters?.clientId ? filters?.clientId : ""}
                sx={{
                  height: "42px",
                  "& .MuiInputBase-root": {
                    height: "42px",
                  },
                }}
                placeholder="Search By Client"
                // value={filters?.prId}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment sx={{ ml: "6px" }} position="start">
                      <img height={15} width={15} src={SearchIcon} alt="Search" />
                    </InputAdornment>
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
            <FormControl sx={{ width: "175px", height: "42px", mr: 2 }}>
              <Select
                id="demo-select-small"
                displayEmpty
                placeholder="Status"
                value={filters?.status}
                sx={{
                  textAlign: "left",
                  background: "#fff",
                  height: "42px",
                }}
                renderValue={
                  filters?.status !== "" ? undefined : () => <MDTypography>Status</MDTypography>
                }
                IconComponent={() => (
                  <InputAdornment position="end" sx={{ mr: "8px" }}>
                    <img height={12} width={12} src={DownArrow} alt="Status" />
                  </InputAdornment>
                )}
                onChange={(e) => handleFilters("status", e.target.value)}
              >
                <MenuItem>
                  <MDTypography fontSize="15px" sx={{color:"#606F7B"}}>
                    Status
                  </MDTypography>
                </MenuItem>
                {statusOptions.map((option: any) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <MDBox
            borderRadius={"5px"}
            bgColor="white"
            sx={{
              height: "42px",
              width: "300px",
              p: 1.6,
              display: "flex",
              alignItems: "center",
              justifyContent: "space=between",
              border: "1px solid lightgray",
            }}
          >
            <Box>
              <MDTypography
                sx={{ fontWeight: "400", mt: "13px" }}
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
                      "& .MuiInputBase-input": {
                        fontSize: "12px", // Change font size
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
                sx={{ fontWeight: "400", mt: "13px" }}
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
                      "& .MuiInputBase-input": {
                        fontSize: "12px", // Change font size
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

import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { statusOptions } from "../../pr-management/components/makeColumns";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import MDInput from "components/MDInput";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "assets/images/icons/searchIcon.svg";
import debounce from "lodash.debounce";
import { visibilityOptions } from "../../../../constants";
import DownArrow from "assets/images/down-arrow.svg";
import MDTypography from "components/MDTypography";

const Filters = ({ filters, handleFilters }: { filters: any; handleFilters: any }) => {
  const [q, setQ] = useState<string>("");

  const checkTitleAvail = useCallback(
    debounce((val: string) => {
      handleFilters("title", val);
    }, 500),
    []
  );
  const handleInputChange = (evt: any) => {
    const searchTerm = evt.target.value || "";
    setQ(searchTerm);
    checkTitleAvail(searchTerm);
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" pt={3}>
        <MDInput
          sx={{ width: 252 }}
          fullWidth
          type="text"
          onChange={handleInputChange}
          value={q}
          placeholder="Search Publications"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img height={15} width={15} src={SearchIcon} alt="Search" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ width: "175px", height: "42px" }}>
          <Select
            id="demo-select-small"
            displayEmpty
            placeholder="Status"
            value={filters?.status || ""}
            sx={{
              textAlign: "left",
              background: "#fff",
              height: "42px",
            }}
            IconComponent={() => (
              <InputAdornment position="end" sx={{ mr: "8px" }}>
                <img height={12} width={12} src={DownArrow} alt="Status" />
              </InputAdornment>
            )}
            onChange={(e) => e.target.value && handleFilters("visibility", e.target.value)}
          >
            <MenuItem value="" disabled sx={{ color: "#606F7B" }}>
              <MDTypography fontSize="15px" sx={{ color: "#606F7B" }}>
                Visibility
              </MDTypography>
            </MenuItem>
            {visibilityOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );
};
export default Filters;

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

const Filters = ({ filters, handleFilters }: { filters: any; handleFilters: any }) => {
  const [q, setQ] = useState<string>("");

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
        <FormControl sx={{ width: "150px", height: "42px" }}>
          <Select
            id="demo-select-small"
            displayEmpty
            placeholder="Status"
            value={filters?.status || ""}
            sx={{
              textAlign: "center",
              background: "#fff",
              height: "42px",
            }}
            onChange={(e) => e.target.value && handleFilters("visibility", e.target.value)}
          >
            <MenuItem value="" disabled>
              Visibility
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

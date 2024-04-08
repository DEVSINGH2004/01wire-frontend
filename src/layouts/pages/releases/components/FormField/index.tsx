import { useMemo } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import MDInput from "components/MDInput";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDLabel from "components/MDLabel";
import { Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MDEditor from "components/MDEditor";
import FileUpload from "./FileUpload";
import InfoIcon from "@mui/icons-material/Info";

// Declaring props types for FormField
interface Props {
  label?: string;
  type?: string;
  name?: string;
  subLabel?: string;
  control?: any;
  options?: any;
  defaultValue?: any;
  [key: string]: any;
}

function FormField({
  label,
  subLabel,
  name,
  type,
  options,
  defaultValue,
  control,
  disabled = false,
  ...rest
}: Props): JSX.Element {
  switch (type) {
    case "dropdown": {
      return (
        <MDBox mb={2}>
          {label && <MDLabel label={label} />}
          <FormControl fullWidth>
            <Controller
              name={name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  id="combo-box-demo"
                  options={options}
                  value={value}
                  onChange={(event, newValue) => {
                    onChange(newValue);
                  }}
                  disabled={disabled}
                  renderInput={(params) => <MDInput {...params} variant="outlined" />}
                />
              )}
            />
          </FormControl>
          {/* <FormHelperText error={true}>{errors?.[name]?.message}</FormHelperText> */}
          {subLabel && (
            <MDTypography fontWeight="regular" fontSize="13px">
              {subLabel}
            </MDTypography>
          )}
        </MDBox>
      );
    }
    case "file": {
      return (
        <MDBox mb={2}>
          {label && <MDLabel label={label} />}
          <FormControl fullWidth>
            <Controller
              name={name}
              control={control}
              defaultValue={defaultValue}
              render={({ field: { onChange, value } }) => (
                <MDBox
                  sx={{
                    minHeight: "150px",
                    background: "#EE5C6114",
                    borderRadius: "8px",
                    border: "1px dashed #F9565C !important",
                    padding: "20px 20px",
                  }}
                >
                  <FileUpload disabled={disabled} value={value} onChange={onChange} />
                </MDBox>
              )}
            />
          </FormControl>
          {/* <FormHelperText error={true}>textsjwkehk</FormHelperText> */}
          {subLabel && (
            <MDBox display="flex" bgColor={"grey-200"} borderRadius="lg" p={1} mt={1}>
              <InfoIcon sx={{ mr: 1 }} color="action" />{" "}
              <MDTypography fontWeight="regular" fontSize="13px">
                {subLabel}
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
      );
    }
    case "editor": {
      return (
        <MDBox mb={2}>
          {label && <MDLabel label={label} />}
          <FormControl fullWidth>
            <Controller
              name={name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <MDEditor disabled={disabled} onChange={onChange} value={value} />
              )}
            />
          </FormControl>
          {/* <FormHelperText error={true}>{errors?.[name]?.message}</FormHelperText> */}
          {subLabel && (
            <MDTypography fontWeight="regular" fontSize="13px">
              {subLabel}
            </MDTypography>
          )}
        </MDBox>
      );
    }
    default: {
      return (
        <MDBox mb={2}>
          {label && <MDLabel label={label} />}
          <FormControl fullWidth>
            <Controller
              name={name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <MDInput disabled={disabled} onChange={onChange} value={value} {...rest} />
              )}
            />
          </FormControl>
          {/* <FormHelperText error={true}>{errors?.[name]?.message}</FormHelperText> */}
          {subLabel && (
            <MDTypography fontWeight="regular" fontSize="13px">
              {subLabel}
            </MDTypography>
          )}
        </MDBox>
      );
    }
  }
}

export default FormField;

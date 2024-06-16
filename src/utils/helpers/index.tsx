import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";

export const ActionsCellRenderer = ({ actions = [] }: { actions: any }) => (
  <MDBox display="flex" alignItems="center" justifyContent="space-between">
    {actions?.map((one: any, i: any) => {
      return (
        <IconButton key={i} onClick={one?.onClick}>
          {one?.label && (
            <MDTypography
              fontSize="16px"
              fontWeight="medium"
              fontFamily="Roboto"
              color="primary"
              mr={1}
            >
              {one.label}
            </MDTypography>
          )}
          <img src={one?.Icon} height={one?.height} width={one?.width} />
        </IconButton>
      );
    })}
  </MDBox>
);
export const genericValidations = {
  text: {
    required: "Please fill value",
  },
  date: {
    required: "Please fill value",
    validate: (date: any) => {
      if (date === "Invalid Date") {
        return "Please input a valid date";
      }
    },
  },
  password: {
    required: "Please Enter Password",
    validate: (pwd: any) => {
      if (pwd?.length < 8) {
        return "Password should contain at least 8 characters";
      }
    },
  },
  number: {
    required: "Please fill value",
    min: {
      value: 1,
      message: "Value should be atleast 1",
    },
  },
  phone: {
    required: "Phone number is required",
    pattern: {
      value: /^\d+$/,
      message: "Invalid phone number",
    },
  },
  email: {
    required: "Please Enter Email",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      message: "Invalid email address",
    },
  },
  url: {
    required: "Please Enter URL",
    pattern: {
      value: /^(ftp|http|https):\/\/[^ "]+$/,
      message: "Invalid url address",
    },
  },
  dropdown: {
    required: "Please fill value",
  },
};

export function removeEmptyFields(obj: { [key: string]: any }): { [key: string]: any } {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] === "") {
      delete obj[key];
    }
  }
  return obj;
}

export const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + '...';
  }
  return str;
}

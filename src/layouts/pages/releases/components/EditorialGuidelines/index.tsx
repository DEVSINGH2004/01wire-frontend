import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

const EditorialGuidelines = ({ onClose }: { onClose: any }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Dialog
        PaperProps={{
          style: {
            height: "628px",
            width: isMobile ? "100%" : "635px",
            boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.2)",
            border: "0.5px solid rgba(0, 0, 0, 0.2)",
          },
        }}
        open
        onClose={onClose}
      >
        <MDBox
          sx={{ background: "rgba(240, 242, 245, 1)" }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <DialogTitle>
            <MDTypography fontSize="16px" fontWeight="medium">
              Editorial Guidelines
            </MDTypography>
          </DialogTitle>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </MDBox>
        <DialogContent>
          <MDTypography fontSize="16px" mt={2} sx={{ fontWeight: 400, color: "rgba(0, 0, 0, 1)" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </MDTypography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditorialGuidelines;

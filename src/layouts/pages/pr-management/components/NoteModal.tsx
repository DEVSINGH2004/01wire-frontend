import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

const NoteModal = ({ handleSubmit, onClose }: { onClose: any; handleSubmit: any }) => {
  const [note, setNote] = useState<String>("");

  return (
    <>
      <Dialog maxWidth="sm" open onClose={onClose}>
        <MDBox display="flex" alignItems="center" justifyContent="space-between">
          <DialogTitle>
            <MDTypography fontSize="16px" fontWeight="medium">
              Update Order Status{" "}
            </MDTypography>
          </DialogTitle>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </MDBox>
        <DialogContent sx={{ width: "454px" }}>
          <MDTypography
            component="label"
            sx={{ mb: "1rem", fontWeight: "500" }}
            fontSize="14px"
            color="textSecondary"
          >
            URL/Notes
          </MDTypography>
          <MDInput
            fullWidth
            type="text"
            onChange={(e: any) => setNote(e.target.value)}
            value={note}
          />
        </DialogContent>
        <Divider />
        <DialogActions
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <MDButton
            sx={{ margin: "auto" }}
            variant="outlined"
            color="primary"
            onClick={() => onClose()}
          >
            Reject
          </MDButton>
          <MDButton
            sx={{ margin: "auto" }}
            variant="contained"
            color="primary"
            disabled={!note}
            onClick={() => {
              handleSubmit(note);
              onClose();
            }}
          >
            Submit
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NoteModal;

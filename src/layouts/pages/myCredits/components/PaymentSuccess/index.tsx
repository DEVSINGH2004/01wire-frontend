import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import SuccessIcon from "assets/images/success.svg";

const PaymentSuccess = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();
  const onClose = () => {
    navigate(-1);
  };
  return (
    <>
      <Dialog
        PaperProps={{
          style: {
            height: "274px",
            width: isMobile ? "100%" : "454px",
            boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.2)",
            border: "0.5px solid rgba(0, 0, 0, 0.2)",
          },
        }}
        open
        onClose={onClose}
      >
        <MDBox display="flex" alignItems="center" justifyContent="space-between">
          <DialogTitle>
            <MDTypography fontSize="16px" fontWeight="medium">
              Payment Status
            </MDTypography>
          </DialogTitle>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </MDBox>
        <DialogContent
          sx={{
            textAlign: "center",
          }}
        >
          <MDBox>
            <MDBox mx="auto">
              <img src={SuccessIcon} height="82px" width="82px" alt="success" />
            </MDBox>
            <MDTypography
              fontSize="24px"
              mt={2}
              sx={{ fontWeight: 700, color: "rgba(8, 226, 109, 1)" }}
            >
              Payment Successful
            </MDTypography>
          </MDBox>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentSuccess;

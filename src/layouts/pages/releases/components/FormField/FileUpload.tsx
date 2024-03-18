import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import MDBox from "components/MDBox";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import { IconButton } from "@mui/material";
import MDTypography from "components/MDTypography";
import axiosInstance from "utils/axiosInstance";
import MDAvatar from "components/MDAvatar";
import CloseIcon from "@mui/icons-material/Close";

const FileUpload = ({ onChange, value }: { onChange: any; value: any }): JSX.Element => {
  console.log("Imgvalue", value);
  const [selectedFile, setSelectedFile] = useState<any>(value);

  const onDrop = useCallback(async (acceptedFiles: any) => {
    console.log("acceptedFiles", acceptedFiles, "onChange", onChange);
    const file = acceptedFiles?.[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File uploaded successfully:", response);
      onChange(response?.data?.fileName);
      setSelectedFile(response?.data?.fileName);

      // Handle successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error
    }
  }, []);

  const handleRemoveFile = () => {
    setSelectedFile("");
    onChange();
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  console.log("img", `${process.env.REACT_APP_IMAGE_BASE_URL}${selectedFile}`);

  return (
    <MDBox height="100%" display="flex" alignItems="center" justifyContent="center">
      {selectedFile ? (
        <MDBox position="relative">
          <MDAvatar
            src={`${process.env.REACT_APP_IMAGE_BASE_URL}${selectedFile}`}
            variant="rounded"
            sx={{
              height: "80px",
              width: "210px",
              borderRadius: "3.47px",
            }}
          />
          <IconButton
            sx={{
              position: "absolute",
              right: -10,
              top: -5,
              background: "#fff",
              height: "20px",
              width: "20px",
            }}
            onClick={handleRemoveFile}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </MDBox>
      ) : (
        <MDBox
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <IconButton>
            <UploadFileIcon />
          </IconButton>
          <MDTypography> Click to upload or drag and drop</MDTypography>
        </MDBox>
      )}
    </MDBox>
  );
};

export default FileUpload;

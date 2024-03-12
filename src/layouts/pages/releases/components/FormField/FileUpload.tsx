

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import MDBox from "components/MDBox";

import UploadFileIcon from '@mui/icons-material/UploadFile';
import { IconButton } from "@mui/material";
import MDTypography from "components/MDTypography";


const FileUpload = (): JSX.Element => {
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);


    const onDrop = useCallback(async (acceptedFiles: any) => {
        setSelectedFiles(acceptedFiles);
    }, []);

    const handleRemoveFile = (index: number) => {
        setSelectedFiles([]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    });

    return (
                    <MDBox height="100%" display="flex" alignItems="center" justifyContent="center">
                                {selectedFiles && selectedFiles.length > 0 ? (
                                    <MDBox >
                                        {selectedFiles.map((file: any, index: number) => (
                                            <MDBox
                                                key={index}
                                            >
                                                <MDTypography>
                                                    {file.name}
                                                </MDTypography>
                                                
                                                    <button
                                                        className="remove-button"
                                                        onClick={() =>
                                                            handleRemoveFile(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        remove
                                                    </button>
                                            </MDBox>
                                        ))}
                                        
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

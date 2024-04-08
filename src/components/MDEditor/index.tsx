import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { EditorState, convertFromHTML, ContentState, Modifier } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import MDEditorRoot from "components/MDEditor/MDEditorRoot";
import { useMaterialUIController } from "context";
import axiosInstance from "utils/axiosInstance";
import { toast } from "react-toastify";
function MDEditor({
  value,
  onChange,
  disabled = false,
}: {
  value: any;
  onChange: any;
  disabled?: any;
}) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [editorState, setEditorState] = React.useState(() => {
    if (value) {
      const contentState = convertFromHTML(value);
      return EditorState.createWithContent(
        ContentState.createFromBlockArray(contentState.contentBlocks, contentState.entityMap)
      );
    }
    return EditorState.createEmpty();
  });

  const uploadCallback = (file: any) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      axiosInstance
        .post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("File uploaded successfully:", response);
          resolve({
            data: { link: process.env.REACT_APP_IMAGE_BASE_URL + response?.data?.fileName },
          });
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          toast.error(error?.message);
          reject(error);
        });
    });
  };
  const config = {
    blockType: {
      inDropdown: true,
      options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6", "Blockquote"],
    },
    image: {
      uploadCallback: uploadCallback,
      previewImage: true,
      alt: { present: true, mandatory: true },
      inputAccept: "image/jpeg,image/jpg,image/png,image/svg",
    },
    // fontFamily: {
    //   options: ["Arial", "Georgia", "Impact", "Tahoma", "Times New Roman", "Verdana"],
    //   onChange: handleFontChange,
    // },
    // fontSize: {
    //   options: [8, 10, 12, 14, 18, 24, 30, 36],
    //   onChange: handleFontSizeChange,
    // },
  };
  const convertToHtmlCustom = (contentState: any) => {
    return convertToHTML({
      entityToHTML: (entity, originalText) => {
        if (entity.type === "IMAGE") {
          const { src, alt, height, width } = entity.data;
          return `<img src="${src}" alt="${alt}" height="${height}" width="${width}" />`;
        } else if (entity.type === "LINK") {
          const { url } = entity.data;
          return `<a href="${url}">${originalText}</a>`;
        }
        return originalText;
      },
    })(contentState);
  };

  useEffect(() => {
    const html = convertToHtmlCustom(editorState.getCurrentContent());
    onChange(html);
  }, [editorState]);
  return (
    <MDEditorRoot ownerState={{ darkMode }}>
      <Editor
        readOnly={disabled}
        toolbarHidden={disabled}
        editorStyle={{ minHeight: "352px" }}
        toolbar={config}
        editorState={editorState}
        onEditorStateChange={setEditorState}
      />
    </MDEditorRoot>
  );
}

// Typechecking props for the MDEditor
MDEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default MDEditor;

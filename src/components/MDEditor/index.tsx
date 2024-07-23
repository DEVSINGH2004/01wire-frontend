import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { EditorState, convertToRaw, convertFromRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import MDEditorRoot from "components/MDEditor/MDEditorRoot";
import { useMaterialUIController } from "context";
import axiosInstance from "utils/axiosInstance";
import { toast } from "react-toastify";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
function MDEditor({
  value,
  onChange,
  disabled = false,
  noBorder = false,
}: {
  value: any;
  onChange: any;
  disabled?: any;
  noBorder?: boolean;
}) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [editorState, setEditorState] = React.useState(() => {
    const contentBlock = value ? htmlToDraft(value) : null;
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      return EditorState.createWithContent(contentState);
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
          console.info("File uploaded successfully:", response);
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
      alignmentEnabled: false,
      alt: { present: true, mandatory: true },
      inputAccept: "image/jpeg,image/jpg,image/png,image/svg",
    },
  };
  const handlePastedText = (
    text: string,
    html: string | undefined,
    editorState: EditorState,
    onChange: (editorState: EditorState) => void
  ): boolean => {
    if (html) {
      const contentBlock = htmlToDraft(`<p></p>${html}<p></p>`);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
          contentBlock.entityMap
        );
        const newEditorState = EditorState.push(editorState, contentState, "insert-characters");
        onChange(newEditorState);
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    onChange(html);
  }, [editorState]);

  return (
    <MDEditorRoot ownerState={{ darkMode }}>
      <Editor
        readOnly={disabled}
        editorClassName={noBorder ? "noBorder-editor-main" : "editorClassName"}
        toolbarHidden={disabled}
        editorStyle={{ minHeight: "352px" }}
        toolbar={config}
        editorState={editorState}
        onEditorStateChange={setEditorState}
        wrapperClassName={noBorder && "noBorder-editor-wrapper"}
        handlePastedText={handlePastedText}
      />
    </MDEditorRoot>
  );
}

// Typechecking props for the MDEditor
MDEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default MDEditor;

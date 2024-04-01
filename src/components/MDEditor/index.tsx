import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import MDEditorRoot from "components/MDEditor/MDEditorRoot";
import { useMaterialUIController } from "context";

function MDEditor({ value, onChange }: { value: any; onChange: any }) {
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

  useEffect(() => {
    const html = convertToHTML(editorState.getCurrentContent());
    onChange(html);
  }, [editorState]);

  return (
    <MDEditorRoot ownerState={{ darkMode }}>
      <Editor editorState={editorState} onEditorStateChange={setEditorState} />
    </MDEditorRoot>
  );
}

// Typechecking props for the MDEditor
MDEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default MDEditor;

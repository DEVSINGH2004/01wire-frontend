import React from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// draft-js
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Custom styles for the MDEditor
import MDEditorRoot from "components/MDEditor/MDEditorRoot";

// Material Dashboard 2 PRO React context
import { useMaterialUIController } from "context";

function MDEditor({ value, onChange }: { value: any; onChange: any }) {
  console.log("value", value);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [convertedContent, setConvertedContent] = React.useState(null);
  const [editorState, setEditorState] = React.useState(() => {
    if (value) {
      const contentState = convertFromHTML(value);
      console.log("contentState", contentState);
      return EditorState.createWithContent(
        ContentState.createFromBlockArray(contentState.contentBlocks, contentState.entityMap)
      );
    }
    return EditorState.createEmpty();
  });

  React.useEffect(() => {
    console.log("editorState.getCurrentContent()", editorState.getCurrentContent());
    const html = convertToHTML(editorState.getCurrentContent());
    console.log("html", html);
    onChange(html);
    setConvertedContent(html);
  }, [editorState]);
  console.log("convertedContent", convertedContent);
  return (
    <MDEditorRoot ownerState={{ darkMode }}>
      {value && typeof value === "function" && value(convertedContent)}
      <Editor editorState={editorState} onEditorStateChange={setEditorState} />
    </MDEditorRoot>
  );
}

// Setting default values for the props of MDEditor
// MDEditor.defaultProps = {
//   value: () => {},
// };

// Typechecking props for the MDEditor
MDEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default MDEditor;

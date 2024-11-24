import React, { useEffect, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";

const MyEditor = ({ data }) => {
  const editorRef = useRef();
  useEffect(() => {
    if (data) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(data);
    }
  }, [data]);
  return (
    <Editor
      initialValue="Your result will appear here"
      initialEditType="wysiwyg"
      height="700px"
      ref={editorRef}
      useCommandShortcut={true}
      onChange={() =>
        console.log(editorRef.current.getInstance().getMarkdown())
      }
    />
  );
};

export default MyEditor;

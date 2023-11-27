import React, { useEffect, useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import { Modifier } from "draft-js";
import { convertFromRaw } from "draft-js";
import { convertToRaw } from "draft-js";

const DraftEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    // Retrieve content from local storage on initial load
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  const styleMap = {
    RED: {
      color: "red",
    },
    CODE: {
      backgroundColor: "yellow",
    },
  };

  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const currentBlock = contentState.getBlockForKey(selection.getStartKey());
  const currentText = currentBlock.getText();
  const contentText = contentState.getPlainText();

  // To run after every text change
  useEffect(() => {
    const endText = currentText.slice(-5);

    // Check if the "*" character is followed by a space
    if (endText.endsWith("* ") && !endText.includes("**")) {
      // To remove the special characters by update editor state
      const newContent = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: contentText.indexOf("* "),
          focusOffset: contentText.indexOf("* ") + 2,
        }),
        "",
        contentState.getSelectionAfter()
      );
      const newEditorState = EditorState.push(
        editorState,
        newContent,
        "insert-characters"
      );

      // To set the inline style and update text
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
    }

    // Check if the "**" character is followed by a space
    if (endText.endsWith("** ") && !endText.includes("***")) {
      // To remove the special characters by update editor state
      const newContent = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: contentText.indexOf("** "),
          focusOffset: contentText.indexOf("** ") + 3,
        }),
        "",
        contentState.getSelectionAfter()
      );
      const newEditorState = EditorState.push(
        editorState,
        newContent,
        "insert-characters"
      );

      // To set the inline style and update text
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "RED"));
    }

    // Check if the "***" character is followed by a space
    if (endText.endsWith("*** ")) {
      // To remove the special characters by update editor state
      const newContent = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: contentText.indexOf("*** "),
          focusOffset: contentText.indexOf("*** ") + 4,
        }),
        "",
        contentState.getSelectionAfter()
      );
      const newEditorState = EditorState.push(
        editorState,
        newContent,
        "insert-characters"
      );

      // To set the inline style and update text
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE"));
    }

    // Check if the "```" character is followed by a space
    if (endText.endsWith("``` ")) {
      // To remove the special characters by update editor state
      const newContent = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: contentText.indexOf("``` "),
          focusOffset: contentText.indexOf("``` ") + 4,
        }),
        "",
        contentState.getSelectionAfter()
      );
      const newEditorState = EditorState.push(
        editorState,
        newContent,
        "insert-characters"
      );

      // To set the inline style and update text
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "CODE"));
    }

    // Check if the "#" character is followed by a space
    if (endText.endsWith("# ")) {
      // To remove the special characters by update editor state
      const newContent = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: contentText.indexOf("# "),
          focusOffset: contentText.indexOf("# ") + 2,
        }),
        "",
        contentState.getSelectionAfter()
      );
      const newEditorState = EditorState.push(
        editorState,
        newContent,
        "insert-characters"
      );

      // To set the inline style and update text
      setEditorState(RichUtils.toggleBlockType(newEditorState, "header-one"));
    }
  }, [contentText]);

  const saveToLocalStorage = () => {
    const contentState = editorState.getCurrentContent();
    const contentStateJSON = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem("editorContent", contentStateJSON);
    alert("Saved to local storage");
  };

  return (
    <div id="draft-editor" className="editor">
      <div className="header-container">
        <div className="flex-1" />
        <h3 className="heading flex-1">Demo Editor by Ujjwal Sharma</h3>
        <div className="flex-1">
          <button className="button" onClick={saveToLocalStorage}>
            Save
          </button>
        </div>
      </div>
      <Editor
        editorState={editorState}
        customStyleMap={styleMap}
        onChange={setEditorState}
      />
    </div>
  );
};

export default DraftEditor;

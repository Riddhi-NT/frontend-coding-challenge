import { $getRoot, EditorState } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import { onError } from "../utils/utilityMethods";
import { editorTheme } from "../utils/editorTheme";
import { MarkDownEditorProps } from "../utils/propsTypes";
import FileUploadPlugin from "./plugins/FileUploadPlugin";
import HeaderTitle from "./CommonComponents/HeaderTitle";

const MarkDownEditor = ({ setMarkdownContent }: MarkDownEditorProps) => {
  const onChangePluginHandler = (editorState: EditorState) => {
    editorState.read(() => {
      setMarkdownContent($getRoot().getTextContent());
    });
  };

  const initialConfig = {
    namespace: "MarkdownEditor",
    theme: editorTheme,
    onError: onError,
  };

  return (
    <div className="w-full lg:w-1/2">
      <HeaderTitle title="Markdown Editor" />
      <div className="relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2 w-full">
        <LexicalComposer initialConfig={initialConfig}>
          <FileUploadPlugin setContent={setMarkdownContent} />
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={
              <div className="absolute top-[4.125rem] left-[1.125rem] opacity-50">
                Start writing...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChangePluginHandler} />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </LexicalComposer>
      </div>
    </div>
  );
};

export default MarkDownEditor;

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TRANSFORMERS, $convertFromMarkdownString } from "@lexical/markdown";

import { editorTheme } from "../utils/editorTheme";
import { handleFileDownload, onError } from "../utils/utilityMethods";
import { EDITOR_NODES } from "../utils/constants";
import PreviewUpdatePlugin from "./plugins/PreviewUpdatePlugin";
import HeaderTitle from "./CommonComponents/HeaderTitle";

const MarkdownPreview = ({ markdownText }: { markdownText: string }) => {
  const initialConfig = {
    editable: false,
    namespace: "MarkdownPreview",
    theme: editorTheme,
    onError: onError,
    nodes: EDITOR_NODES,
    editorState: () => $convertFromMarkdownString(markdownText),
  };

  return (
    <div className="w-1/2">
      <HeaderTitle title="Markdown Preview" />
      <button
        onClick={() => {
          handleFileDownload(markdownText);
        }}
        className="my-4 bg-black text-white py-2 px-4 rounded"
      >
        Download
      </button>
      <div className="relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2 w-full">
        <LexicalComposer initialConfig={initialConfig}>
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={<></>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <PreviewUpdatePlugin markdownText={markdownText} />
        </LexicalComposer>
      </div>
    </div>
  );
};

export default MarkdownPreview;

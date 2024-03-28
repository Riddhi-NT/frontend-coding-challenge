import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

import { onError } from "../utils/utilityMethods";
import { editorTheme } from "../utils/editorTheme";
import FileUploadPlugin from "./plugins/FileUploadPlugin";
import { EDITOR_NODES } from "../utils/constants";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import PreviewPlugin from "./plugins/PreviewPlugin";
import FileDownloadPlugin from "./plugins/FileDownloadPlugin";

/**
 * MarkDownEditor Component
 *
 * This component represents a Markdown editor with rich text capabilities. It allows users to compose/upload Markdown file and edit it's content.
 *
 * @component
 * @returns  {JSX.Element} - Returns a JSX element representing the Markdown editor component.
 */
const MarkDownEditor = (): JSX.Element => {
  const initialConfig = {
    namespace: "MarkdownEditor",
    theme: editorTheme,
    onError: onError,
    nodes: EDITOR_NODES,
  };

  return (
    <div className="m-8">
      <h1 className="text-2xl mb-2">Markdown Editor</h1>
      <div className="relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2 w-full">
        <LexicalComposer initialConfig={initialConfig}>
          <FileUploadPlugin />
          <ToolbarPlugin />
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={
              <div className="absolute top-[6.7rem] left-[1.125rem] opacity-50">
                Start writing...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <TabIndentationPlugin />
          <div className="flex justify-between my-4">
            <FileDownloadPlugin />
            <PreviewPlugin />
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
};

export default MarkDownEditor;

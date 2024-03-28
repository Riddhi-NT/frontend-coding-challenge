import { $isCodeNode } from "@lexical/code";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useCallback } from "react";
import { downloadFile } from "../../utils/utilityMethods";

/**
 * FileDownloadPlugin component provides functionality to download the content of a LexicalEditor as a file.
 * If the editor contains code blocks with Markdown language specified, it downloads the content of the first code block as a Markdown file.
 * Otherwise, it converts the editor content to Markdown format using the specified transformers and downloads it as a file.
 * 
 * @component
 */
const FileDownloadPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const handleFileDownload = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();

      if (
        firstChild?.getTextContent() &&
        $isCodeNode(firstChild) &&
        firstChild?.getLanguage() === "markdown"
      ) {
        downloadFile(firstChild?.getTextContent());
      } else {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        downloadFile(markdown);
      }
    });
  }, [editor]);

  return (
    <button
      onClick={() => handleFileDownload()}
      className="bg-black text-white py-2 px-4 rounded"
    >
      Download
    </button>
  );
};

export default FileDownloadPlugin;

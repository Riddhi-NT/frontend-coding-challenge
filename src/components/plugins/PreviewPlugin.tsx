import { $createCodeNode, $isCodeNode } from "@lexical/code";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode, $getRoot } from "lexical";
import { useCallback } from "react";

/**
 * PreviewPlugin component allows users to toggle between Markdown preview mode and editing mode in a LexicalEditor.
 * When clicked, it toggles the view between the Markdown preview of the content and the editing mode.
 * 
 * If the editor's content is in Markdown format (identified by the presence of a code block with language set to "markdown"),
 * it converts the Markdown content to the editor's format using the specified transformers and switches to editing mode.
 * 
 * If the content is not in Markdown format, it converts the editor's content to Markdown format using the specified transformers
 * and displays it in the editor as a code block with language set to "markdown".
 * 
 * @component
 */
const PreviewPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const handleMarkdownToggle = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();
      if ($isCodeNode(firstChild) && firstChild.getLanguage() === "markdown") {
        $convertFromMarkdownString(firstChild.getTextContent(), TRANSFORMERS);
      } else {
        const markdown = $convertToMarkdownString(TRANSFORMERS);

        root
          .clear()
          .append(
            $createCodeNode("markdown").append($createTextNode(markdown))
          );
      }
      root.selectEnd();
    });
  }, [editor]);

  return (
    <button
      className="text-black border-black border-[1px] font-semibold py-2 px-4 rounded h-fit"
      onClick={handleMarkdownToggle}
    >
      Preview
    </button>
  );
};

export default PreviewPlugin;

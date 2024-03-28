import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";

/**
 * FileUploadPlugin Component
 *
 * This component provides functionality for uploading Markdown files into the Lexical editor. It allows users to select a Markdown file from their device and insert its content into the editor.
 *
 * @component
 * @returns {JSX.Element} A JSX.Element representing the FileUploadPlugin component.
 */
const FileUploadPlugin = (): JSX.Element => {
  const [editor] = useLexicalComposerContext();

  const update = (content: string) => {
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      const p = $createParagraphNode();
      p.append($createTextNode(content));
      root.append(p);
      $convertFromMarkdownString(content, TRANSFORMERS);
    });
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        update(content);
      };
      reader.readAsText(file);
    }
  };
  return (
    <div className="mb-16 mt-8">
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-black text-white py-2 px-4 rounded"
      >
        Upload File
      </label>
      <input
        id="file-upload"
        type="file"
        className="hidden my-4"
        accept=".md,.MARKDOWN"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default FileUploadPlugin;

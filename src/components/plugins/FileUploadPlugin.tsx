import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";

import { FileUploadPluginProps } from "../../utils/propsTypes";

const FileUploadPlugin = ({ setContent }: FileUploadPluginProps) => {
  const [editor] = useLexicalComposerContext();

  const update = (content: string) => {
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      const p = $createParagraphNode();
      p.append($createTextNode(content));
      root.append(p);
    });
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setContent(content);
        update(content);
      };
      reader.readAsText(file);
    }
  };
  return (
    <div className="mb-5 mt-8">
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

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { TRANSFORMERS, $convertFromMarkdownString } from "@lexical/markdown";

const PreviewUpdatePlugin = ({ markdownText }: { markdownText: string }) => {
  const [editor] = useLexicalComposerContext();

  editor.update(() => {
    const root = $getRoot();
    root.clear();
    const p = $createParagraphNode();
    p.append($createTextNode(markdownText));
    root.append(p);
    $convertFromMarkdownString(markdownText, TRANSFORMERS);
  });

  return <></>;
};

export default PreviewUpdatePlugin;

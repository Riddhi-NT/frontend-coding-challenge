import { useState } from "react";
import MarkDownEditor from "./components/MarkDownEditor";
import MarkdownPreview from "./components/MarkdownPreview";
import "./App.css";

function App() {
  const [markdownContent, setMarkdownContent] = useState<string>("");

  return (
    <div className="m-8 flex flex-col lg:flex-row gap-2">
      <MarkDownEditor setMarkdownContent={setMarkdownContent} />
      <MarkdownPreview markdownText={markdownContent} />
    </div>
  );
}

export default App;

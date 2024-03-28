import { Dispatch, SetStateAction } from "react";

export interface MarkDownEditorProps {
  setMarkdownContent: Dispatch<SetStateAction<string>>;
}

export interface FileUploadPluginProps {
  setContent: Dispatch<SetStateAction<string>>;
}

export interface HeaderTitleProps {
  title: string;
}

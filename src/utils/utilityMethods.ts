export const handleFileDownload = (content: string) => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/markdown" });
  element.href = URL.createObjectURL(file);
  element.download = "edited_file.md";
  document.body.appendChild(element);
  element.click();
};

export const onError = (error: Error): void => {
  throw error;
};



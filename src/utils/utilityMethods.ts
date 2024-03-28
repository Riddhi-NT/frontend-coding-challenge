/**
 * handleFileDownload
 *
 * Downloads the provided content as a Markdown file.
 *
 * @param {string} content - The content to be downloaded as a Markdown file.
 * @returns {void}
 */
export const downloadFile = (content: string): void => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/markdown" });
  element.href = URL.createObjectURL(file);
  element.download = "edited_file.md";
  document.body.appendChild(element);
  element.click();
};

/**
 * onError
 *
 * Error handling function that throws the provided error from lexical editor.
 *
 * @param {Error} error - The error to be thrown.
 * @returns {void}
 */
export const onError = (error: Error): void => {
  throw error;
};

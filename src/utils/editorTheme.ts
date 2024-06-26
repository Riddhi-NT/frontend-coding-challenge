/**
 * editorTheme
 *
 * The theme object defining styles for the Lexical editor components.
 *
 * @type {Object}
 * @property {string} root - Styles for the root container of the editor.
 * @property {string} link - Styles for links within the editor.
 * @property {Object} text - Styles for text elements within the editor, including code, bold, underline, italic, strikethrough, and combined underline-strikethrough.
 * @property {Object} list - Styles for list elements within the editor, including nested lists, ordered lists (ol), unordered lists (ul), and list items.
 * @property {string} code - Styles for code blocks within the editor.
 * @property {Object} codeHighlight - Styles for syntax highlighting within code blocks, including various token types such as keywords, strings, variables, etc.
 */
export const editorTheme = {
  root: "p-4 border-slate-500 border-2 rounded min-h-[200px] focus:outline-none focus-visible:border-black h-[70vh] overflow-auto",
  link: "cursor-pointer",
  text: {
    code: "editor-text-code",
    bold: "font-semibold",
    underline: "underline decoration-wavy",
    italic: "italic",
    strikethrough: "line-through",
    underlineStrikethrough: "underlined-line-through",
  },
  list: {
    nested: {
      listitem: "list-none editor-nested-listitem",
    },
    ol: "p-0 m-0 ml-4",
    ul: "p-0 m-0 ml-4",
    listitem: "mx-4 my-1",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
};

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $getNodeByKey,
  EditorState,
  LexicalEditor,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isAtNodeEnd, $setBlocksType } from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import { createPortal } from "react-dom";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages,
} from "@lexical/code";
import "../../styles/toolbarPlugin.css";

const LowPriority = 1;

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
]);

const blockTypeToBlockName = {
  code: "Code Block",
  h1: "Heading",
  h2: "Heading",
  h3: "Heading",
  h4: "Heading",
  h5: "Heading",
  h6: "Heading",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List",
} as { [key: string]: string };

const Divider = () => {
  return <div className="w-[1px] bg-[#eee] my-0 mx-1" />;
};

const positionEditorElement = (editor: HTMLElement, rect: DOMRect | null) => {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
};

const FloatingLinkEditor = ({ editor }: { editor: LexicalEditor }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState<any>(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      !nativeSelection?.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection?.anchorNode ?? null)
    ) {
      const domRange = nativeSelection?.getRangeAt(0);
      let rect;
      if (nativeSelection?.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild as HTMLElement;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange?.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect ?? null);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(
        ({ editorState }: { editorState: EditorState }) => {
          editorState.read(() => {
            updateLinkEditor();
          });
        }
      ),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority
      )
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== "") {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === "Escape") {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className="link-edit"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

const Select = ({
  onChange,
  className,
  options,
  value,
}: {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className: string;
  options: Array<string>;
  value: string;
}) => {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option: string) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const getSelectedNode = (selection: any) => {
  const anchor = selection?.anchor;
  const focus = selection?.focus;
  const anchorNode = selection?.anchor?.getNode();
  const focusNode = selection?.focus?.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection?.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
};

const BlockOptionsDropdownList = ({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,
}: {
  editor: LexicalEditor;
  blockType: string;
  toolbarRef: RefObject<HTMLDivElement>;
  setShowBlockOptionsDropDown: Dispatch<SetStateAction<boolean>>;
}) => {
  const dropDownRef = useRef<any>(null);

  useEffect(() => {
    const toolbar = toolbarRef?.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef?.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event: MouseEvent | null) => {
        const target = event?.target ?? null;

        if (!dropDown.contains(target) && !toolbar.contains(target as Node)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatHeading = (headingTag: HeadingTagType) => {
    if (blockType !== headingTag) {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingTag));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  //   const formatLargeHeading = () => {
  //     if (blockType !== "h1") {
  //       editor.update(() => {
  //         const selection = $getSelection();

  //         if ($isRangeSelection(selection)) {
  //           $setBlocksType(selection, () => $createHeadingNode("h1"));
  //         }
  //       });
  //     }
  //     setShowBlockOptionsDropDown(false);
  //   };

  //   const formatSmallHeading = () => {
  //     if (blockType !== "h2") {
  //       editor.update(() => {
  //         const selection = $getSelection();

  //         if ($isRangeSelection(selection)) {
  //           $setBlocksType(selection, () => $createHeadingNode("h2"));
  //         }
  //       });
  //     }
  //     setShowBlockOptionsDropDown(false);
  //   };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  return (
    <div className="dropdown" ref={dropDownRef}>
      <button className="item" onClick={formatParagraph}>
        <span className="icon paragraph" />
        <span className="text">Normal</span>
        {blockType === "paragraph" && <span className="active" />}
      </button>
      <button className="item" onClick={() => formatHeading("h1")}>
        <span className="font-semibold mr-2">H1</span>
        <span className="text">Heading</span>
        {blockType === "h1" && <span className="active" />}
      </button>
      <button className="item" onClick={() => formatHeading("h2")}>
        <span className="font-semibold mr-2">H2</span>
        <span className="text">Heading</span>
        {blockType === "h2" && <span className="active" />}
      </button>
      <button className="item" onClick={() => formatHeading("h3")}>
        <span className="font-semibold mr-2">H3</span>
        <span className="text">Heading</span>
        {blockType === "h3" && <span className="active" />}
      </button>
      <button className="item" onClick={() => formatHeading("h4")}>
        <span className="font-semibold mr-2">H4</span>
        <span className="text">Heading</span>
        {blockType === "h4" && <span className="active" />}
      </button>
      <button className="item" onClick={() => formatHeading("h5")}>
        <span className="font-semibold mr-2">H5</span>
        <span className="text">Heading</span>
        {blockType === "h5" && <span className="active" />}
      </button>
      <button className="item" onClick={() => formatHeading("h6")}>
        <span className="font-semibold mr-2">H6</span>
        <span className="text">Heading</span>
        {blockType === "h6" && <span className="active" />}
      </button>
      <button className="item" onClick={formatBulletList}>
        <span className="icon bullet-list" />
        <span className="text">Bullet List</span>
        {blockType === "ul" && <span className="active" />}
      </button>
      <button className="item" onClick={formatNumberedList}>
        <span className="icon numbered-list" />
        <span className="text">Numbered List</span>
        {blockType === "ol" && <span className="active" />}
      </button>
      <button className="item" onClick={formatQuote}>
        <span className="icon quote" />
        <span className="text">Quote</span>
        {blockType === "quote" && <span className="active" />}
      </button>
      <button className="item" onClick={formatCode}>
        <span className="icon code" />
        <span className="text">Code Block</span>
        {blockType === "code" && <span className="active" />}
      </button>
    </div>
  );
};

/**
 * ToolbarPlugin component represents a toolbar for text formatting and block-level editing in a LexicalEditor.
 * It provides options for formatting text (bold, italic, underline, strikethrough), inserting and editing links,
 * selecting block types (e.g., paragraph, headings, lists, code blocks), and selecting code languages.
 * 
 * @component
 */
const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [blockType, setBlockType] = useState<string>("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<any>(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] =
    useState<boolean>(false);
  const [codeLanguage, setCodeLanguage] = useState("");
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const codeLanguges = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div
      className="toolbar flex bg-white p-1 rounded-t-lg align-middle mb-px md:gap-2 absolute top-[43px] w-full border"
      ref={toolbarRef}
    >
      {supportedBlockTypes.has(blockType) && (
        <>
          <button
            className="toolbar-item block-controls flex rounded-lg p-2 align-middle"
            onClick={() =>
              setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
            }
            aria-label="Formatting Options"
          >
            <span className={"icon block-type " + blockType} />
            <span className="text">{blockTypeToBlockName[blockType]}</span>
            <i className="chevron-down" />
          </button>
          {showBlockOptionsDropDown &&
            createPortal(
              <BlockOptionsDropdownList
                editor={editor}
                blockType={blockType}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
              />,
              document.body
            )}
          <Divider />
        </>
      )}
      {blockType === "code" ? (
        <>
          <Select
            className="toolbar-item code-language"
            onChange={onCodeLanguageSelect}
            options={codeLanguges}
            value={codeLanguage}
          />
          <i className="chevron-down inside" />
        </>
      ) : (
        <>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            className={"toolbar-item spaced " + (isBold ? "active" : "")}
            aria-label="Format Bold"
          >
            <i className="format bold" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            className={"toolbar-item spaced " + (isItalic ? "active" : "")}
            aria-label="Format Italics"
          >
            <i className="format italic" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
            aria-label="Format Underline"
          >
            <i className="format underline" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            }}
            className={
              "toolbar-item spaced " + (isStrikethrough ? "active" : "")
            }
            aria-label="Format Strikethrough"
          >
            <i className="format strikethrough" />
          </button>
          <button
            onClick={insertLink}
            className={"toolbar-item spaced " + (isLink ? "active" : "")}
            aria-label="Insert Link"
          >
            <i className="format link" />
          </button>
          {isLink &&
            createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
        </>
      )}
    </div>
  );
};

export default ToolbarPlugin;

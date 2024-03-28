import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";

/**
 * EDITOR_NODES
 *
 * Array containing various node components used in the Lexical editor.
 *
 */
export const EDITOR_NODES = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
];

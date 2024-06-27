import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import BlockComponent from "./BlockComponent";

export default Node.create({
  name: "blockComponent",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      type: {
        default: "",
      },
      title: {
        default: "",
      },
      text: {
        default: "",
      },
      link_text: {
        default: "",
      },
      link_url: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "block-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["block-component", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlockComponent);
  },
});

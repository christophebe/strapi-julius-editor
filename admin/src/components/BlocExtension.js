import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import BlocComponent from "./BlocComponent";

export default Node.create({
  name: "blocComponent",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      type: {
        default: "info",
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
        tag: "bloc-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["bloc-component", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlocComponent);
  },
});

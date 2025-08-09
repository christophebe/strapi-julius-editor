import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Tiptap node extension to render HTML <video> tags.
 * Generates plain HTML in the editor output so it can be consumed directly by frontends.
 *
 * Supported attributes (as node attrs):
 * - src: string (required)
 * - controls, autoplay, loop, muted, playsinline: boolean flags
 * - width, height: number|string
 */
const VideoExtension = Node.create({
  name: "video",
  group: "block",
  inline: false,
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      type: { default: null },
      src2: { default: null },
      type2: { default: null },
      controls: { default: true },
      autoplay: { default: false },
      loop: { default: false },
      muted: { default: false },
      playsinline: { default: true },
      width: { default: null },
      height: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video",
        getAttrs: (element) => {
          const videoEl = element;
          // Support <video src> and multiple <source> children
          const sources = Array.from(
            videoEl.querySelectorAll ? videoEl.querySelectorAll("source") : []
          );
          const primary = sources[0];
          const secondary = sources[1];
          const src =
            primary?.getAttribute("src") || videoEl.getAttribute("src");
          const type = primary?.getAttribute("type") || null;
          const src2 = secondary?.getAttribute("src") || null;
          const type2 = secondary?.getAttribute("type") || null;

          return {
            src,
            type,
            src2,
            type2,
            controls: videoEl.hasAttribute("controls"),
            autoplay: videoEl.hasAttribute("autoplay"),
            loop: videoEl.hasAttribute("loop"),
            muted: videoEl.hasAttribute("muted"),
            playsinline: videoEl.hasAttribute("playsinline"),
            width: videoEl.getAttribute("width"),
            height: videoEl.getAttribute("height"),
          };
        },
      },
    ];
  },

  /**
   * Render a simple <video> tag with attributes. We keep it minimal and rely on the browser
   * to handle a single src. If multiple formats are required, they can be added later.
   */
  renderHTML({ HTMLAttributes }) {
    const { src, type, src2, type2, ...rest } = HTMLAttributes;

    // Normalize boolean attributes so that truthy flags are present without a value
    const normalizedAttrs = {};
    Object.entries(rest).forEach(([key, value]) => {
      if (value === true) normalizedAttrs[key] = "";
      else if (value) normalizedAttrs[key] = value;
    });

    const attrs = mergeAttributes(normalizedAttrs);
    const children = [];
    if (src) {
      const sourceAttrs = { src };
      if (type) sourceAttrs.type = type;
      children.push(["source", sourceAttrs]);
    }
    if (src2) {
      const source2Attrs = { src: src2 };
      if (type2) source2Attrs.type = type2;
      children.push(["source", source2Attrs]);
    }
    return ["video", attrs, ...children];
  },

  addCommands() {
    return {
      setVideo:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});

export default VideoExtension;

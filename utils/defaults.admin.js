const defaults = {
  headings: ["h1", "h2", "h3", "h4", "h4", "h5", "h6"],
  bold: true,
  italic: true,
  strikethrough: true,
  underline: true,
  code: true,
  blockquote: true,
  color: true,
  highlight: true,
  align: ["left", "center", "right"],
  lists: ["ol", "ul"],
  disableOrderedListShorthand: false,
  table: true,
  hardbreak: true,
  horizontal: true,
  links: {
    enabled: true,
    autolink: false,
    openOnClick: false,
    linkOnPaste: true,
    relAttribute: false,
    HTMLAttributes: {
      rel: "",
    },
  },
  image: {
    enabled: true,
    inline: true,
    allowBase64: false,
  },
  video: {
    enabled: true,
    // default HTML attributes for inserted videos
    controls: true,
    autoplay: false,
    loop: false,
    muted: false,
    playsinline: true,
  },
  other: {
    wordcount: false,
    saveJson: false,
  },
  youtube: {
    enabled: true,
    height: 480,
    width: 640,
  },
  contentBlocks: {
    types: "info,tips,quote,note",
  },
};

export default defaults;

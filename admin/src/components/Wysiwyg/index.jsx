import { Box, Field, Typography } from "@strapi/design-system";
import PropTypes from "prop-types";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { getFetchClient, useField } from "@strapi/strapi/admin";
import { getSettings } from "../../../../utils/api";
import defaultSettings from "../../../../utils/defaults.admin.js";
import Editor from "../Editor";

// Editor
import BlockquoteExtension from "@tiptap/extension-blockquote";
import BoldExtension from "@tiptap/extension-bold";
import BulletListExtension from "@tiptap/extension-bullet-list";
import CharacterCountExtension from "@tiptap/extension-character-count";
import CodeExtension from "@tiptap/extension-code";
import CodeBlockExtension from "@tiptap/extension-code-block";
import { Color as ColorExtension } from "@tiptap/extension-color";
import DocumentExtension from "@tiptap/extension-document";
import GapcursorExtension from "@tiptap/extension-gapcursor";
import HardBreakExtension from "@tiptap/extension-hard-break";
import HeadingExtension from "@tiptap/extension-heading";
import HighlightExtension from "@tiptap/extension-highlight";
import History from "@tiptap/extension-history";
import HorizontalRuleExtension from "@tiptap/extension-horizontal-rule";
import ImageExtension from "@tiptap/extension-image";
import ItalicExtension from "@tiptap/extension-italic";
import LinkExtension from "@tiptap/extension-link";
import ListItemExtension from "@tiptap/extension-list-item";
import OrderedListExtension from "@tiptap/extension-ordered-list";
import ParagraphExtension from "@tiptap/extension-paragraph";
import StrikeExtension from "@tiptap/extension-strike";
import TableExtension from "@tiptap/extension-table";
import TableCellExtension from "@tiptap/extension-table-cell";
import TableHeaderExtension from "@tiptap/extension-table-header";
import TableRowExtension from "@tiptap/extension-table-row";
import TextExtension from "@tiptap/extension-text";
import TextAlignExtension from "@tiptap/extension-text-align";
import TextStyleExtension from "@tiptap/extension-text-style";
import UnderlineExtension from "@tiptap/extension-underline";
import YouTubeExtension from "@tiptap/extension-youtube";
import { useEditor } from "@tiptap/react";
import { mergeDeep } from "../../utils/merge";
import BlockExtension from "../BlockExtension.js";
import VideoExtension from "../VideoExtension";
import Stack from "../Stack";

const Wysiwyg = (opts) => {
  const {
    name,
    onChange,
    value: propValue,
    intlLabel,
    labelAction,
    disabled,
    error,
    description,
    required,
  } = opts;
  const field = useField(name);
  const value = field?.value ?? propValue;
  const fieldOnChange = field?.onChange ?? onChange;

  const [savedSettings, setSavedSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getSettings()
      .then((data) => {
        if (isMounted) {
          setSavedSettings(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSavedSettings(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const settings = mergeDeep(
    JSON.parse(JSON.stringify(defaultSettings)),
    savedSettings ?? {}
  );
  if (isLoading) return null;

  return (
    <WysiwygContent
      name={name}
      onChange={fieldOnChange}
      value={value}
      intlLabel={intlLabel}
      labelAction={labelAction}
      disabled={disabled}
      error={error}
      description={description}
      required={required}
      settings={settings}
    />
  );
};

const CustomOrderedList = OrderedListExtension.extend({
  addInputRules() {
    return [];
  },
});

const WysiwygContent = ({
  name,
  onChange,
  value,
  intlLabel,
  labelAction,
  disabled,
  error,
  description,
  required,
  settings,
}) => {
  const handleChange = onChange ?? (() => {});
  const { formatMessage } = useIntl();
  const formatMessageSafe = (message, fallback = "") => {
    if (!message) return fallback;
    if (typeof message === "string") return message;
    if (message.id) return formatMessage(message);
    if (message.defaultMessage) return message.defaultMessage;
    return fallback;
  };
  const [currentContent, setCurrentContent] = useState("");
  const lastValueKeyRef = useRef(null);
  const saveModeRef = useRef("html");
  const hydratedContentRef = useRef(false);
  const fallbackFetchedRef = useRef(false);
  const lastEmittedValueRef = useRef(null);
  const lastEmittedAtRef = useRef(0);
  /** When true, TipTap updates come from sync effects — must not mark the Strapi form dirty. */
  const isApplyingExternalContentRef = useRef(false);
  const location = useLocation();
  /** Strapi EditView draft/published tab (`?status=`). Drives refetch + form reset. */
  const documentStatus =
    new URLSearchParams(location.search).get("status") ?? "draft";
  /** Latest disabled flag for onUpdate (useEditor closure is stable). */
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;
  /** Latest Strapi field value — onUpdate closure must not treat stale props as "no-op". */
  const formValueRef = useRef(value);
  formValueRef.current = value;

  /**
   * Draft ↔ Published switches refetch the document; reset sync guards so we never
   * treat a stale `lastValueKeyRef` as authoritative while TipTap was cleared or rebuilt.
   */
  useEffect(() => {
    lastValueKeyRef.current = null;
    lastEmittedValueRef.current = null;
    hydratedContentRef.current = false;
    fallbackFetchedRef.current = false;
  }, [documentStatus]);

  const isTiptapDoc = (doc) =>
    doc &&
    typeof doc === "object" &&
    doc.type === "doc" &&
    Array.isArray(doc.content);

  const asDoc = (contentArray) => ({
    type: "doc",
    content: contentArray,
  });

  const deriveContent = (rawValue) => {
    if (rawValue === undefined) {
      return { content: "", saveMode: "html" };
    }

    if (rawValue === null || rawValue === "") {
      return { content: "", saveMode: "html" };
    }

    if (typeof rawValue === "string") {
      try {
        const parsed = JSON.parse(rawValue);
        if (isTiptapDoc(parsed)) {
          return { content: parsed, saveMode: "json-string" };
        }
      } catch (e) {
        // Not JSON, continue as HTML.
      }

      return { content: rawValue, saveMode: "html" };
    }

    if (Array.isArray(rawValue)) {
      return { content: asDoc(rawValue), saveMode: "json-array" };
    }

    if (typeof rawValue === "object") {
      if (isTiptapDoc(rawValue)) {
        return { content: rawValue, saveMode: "json-object" };
      }

      if (Array.isArray(rawValue.content)) {
        return { content: asDoc(rawValue.content), saveMode: "json-object" };
      }

      if (typeof rawValue.content === "string") {
        return { content: rawValue.content, saveMode: "html" };
      }

      if (typeof rawValue.html === "string") {
        return { content: rawValue.html, saveMode: "html" };
      }

      if (typeof rawValue.data === "string") {
        try {
          const parsed = JSON.parse(rawValue.data);
          if (isTiptapDoc(parsed)) {
            return { content: parsed, saveMode: "json-string" };
          }
        } catch (e) {
          // Not JSON, continue as HTML.
        }

        return { content: rawValue.data, saveMode: "html" };
      }

      if (rawValue.data && Array.isArray(rawValue.data.content)) {
        return { content: asDoc(rawValue.data.content), saveMode: "json-object" };
      }
    }

    return { content: "", saveMode: "html" };
  };

  /**
   * Returns true when TipTap output is already what the Strapi form holds.
   * Stops spurious handleChange (Formik dirty) after Draft↔Published or programmatic sync.
   *
   * Strapi often stores richtext as a TipTap doc object in the admin form; we compare `getJSON()`.
   */
  const editorOutputMatchesFormValue = (
    nextValue,
    saveModeForEmit,
    rawFormValue,
    editorInstance
  ) => {
    if (editorInstance) {
      try {
        const edJson = editorInstance.getJSON();
        if (
          rawFormValue &&
          typeof rawFormValue === "object" &&
          !Array.isArray(rawFormValue) &&
          rawFormValue.type === "doc"
        ) {
          if (JSON.stringify(rawFormValue) === JSON.stringify(edJson)) {
            return true;
          }
        }
        const { content: derivedFromForm } = deriveContent(rawFormValue);
        if (
          derivedFromForm &&
          typeof derivedFromForm === "object" &&
          derivedFromForm.type === "doc"
        ) {
          if (JSON.stringify(derivedFromForm) === JSON.stringify(edJson)) {
            return true;
          }
        }
      } catch {
        // continue with serialized comparisons
      }
    }

    const { content } = deriveContent(rawFormValue);
    if (saveModeForEmit === "json-string") {
      try {
        return JSON.stringify(content) === nextValue;
      } catch {
        return false;
      }
    }
    if (saveModeForEmit === "json-object") {
      try {
        return JSON.stringify(content) === JSON.stringify(nextValue);
      } catch {
        return false;
      }
    }
    if (saveModeForEmit === "json-array") {
      try {
        const docSlice =
          content &&
          typeof content === "object" &&
          content.type === "doc" &&
          Array.isArray(content.content)
            ? content.content
            : content;
        return JSON.stringify(docSlice ?? []) === JSON.stringify(nextValue);
      } catch {
        return false;
      }
    }
    if (typeof content === "string" && content === nextValue) {
      return true;
    }
    if (typeof rawFormValue === "string" && rawFormValue === nextValue) {
      return true;
    }
    return false;
  };

  const editor = useEditor({
    editable: !disabled,
    extensions: [
      // CTA
      BlockExtension,

      // Text
      DocumentExtension,
      ParagraphExtension,
      TextExtension,
      BoldExtension,
      StrikeExtension,
      ItalicExtension,
      GapcursorExtension,
      ListItemExtension,
      BulletListExtension,
      HeadingExtension,

      settings.disableOrderedListShorthand
        ? CustomOrderedList
        : OrderedListExtension,
      settings.code ? CodeBlockExtension : null,
      settings.code ? CodeExtension : null,
      settings.blockquote ? BlockquoteExtension : null,
      settings.horizontal ? HorizontalRuleExtension : null,
      settings.hardbreak ? HardBreakExtension : null,

      UnderlineExtension,
      TextAlignExtension.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyleExtension,
      settings.color ? ColorExtension : null,
      settings.highlight
        ? HighlightExtension.configure({ multicolor: true })
        : null,
      // Links
      settings.links.enabled
        ? LinkExtension.configure({
            autolink: settings.links.autolink,
            openOnClick: settings.links.openOnClick,
            linkOnPaste: settings.links.linkOnPaste,
            HTMLAttributes: {
              rel: settings.links.HTMLAttributes.rel,
            },
          })
        : null,

      // Images
      settings.image.enabled
        ? ImageExtension.extend({
            addAttributes() {
              return {
                ...this.parent?.(),
                width: { default: null },
                height: { default: null },
                loading: { default: null },
                renderHTML: (attributes) => {
                  return {
                    width: attributes.width,
                    height: attributes.height,
                    loading: attributes.loading,
                  };
                },
              };
            },
          }).configure({
            inline: settings.image.inline,
            allowBase64: settings.image.allowBase64,
          })
        : null,

      // Video
      settings.video && settings.video.enabled ? VideoExtension : null,

      // Table
      settings.table
        ? TableExtension.configure({
            allowTableNodeSelection: true,
          })
        : null,
      settings.table ? TableRowExtension : null,
      settings.table ? TableCellExtension : null,
      settings.table ? TableHeaderExtension : null,

      settings.other && settings.other.wordcount
        ? CharacterCountExtension.configure()
        : null,

      settings.youtube.enabled
        ? YouTubeExtension.configure({
            inline: false,
          })
        : null,
      History,
    ],
    parseOptions: {
      preserveWhitespace: "full",
    },
    onUpdate(ctx) {
      if (disabledRef.current || isApplyingExternalContentRef.current) {
        return;
      }
      const tr = ctx.transaction;
      if (tr != null && tr.docChanged === false) {
        return;
      }
      const saveMode = settings.other.saveJson
        ? "json-string"
        : saveModeRef.current;
      let nextValue = ctx.editor.getHTML();

      if (saveMode === "json-string") {
        nextValue = JSON.stringify(ctx.editor.getJSON());
      } else if (saveMode === "json-object") {
        nextValue = ctx.editor.getJSON();
      } else if (saveMode === "json-array") {
        nextValue = ctx.editor.getJSON().content ?? [];
      }

      if (
        editorOutputMatchesFormValue(
          nextValue,
          saveMode,
          formValueRef.current,
          ctx.editor
        )
      ) {
        return;
      }

      lastEmittedValueRef.current = nextValue;
      lastEmittedAtRef.current = Date.now();
      handleChange({
        target: { name, type: "richtext", value: nextValue },
      });
    },
  });

  /**
   * Keep TipTap in sync with Strapi form state (e.g. Published tab is read-only while Draft is editable).
   * InputRenderer sets disabled when the whole form is disabled.
   */
  useLayoutEffect(() => {
    if (!editor) return;
    // TipTap's setEditable(editable, emitUpdate) defaults emitUpdate=true, which
    // fires the `update` event and would mark the Strapi form dirty on Draft↔Published.
    editor.setEditable(!disabled, false);
  }, [editor, disabled]);

  const runExternalEditorCommand = useCallback((fn) => {
    isApplyingExternalContentRef.current = true;
    try {
      fn();
    } finally {
      queueMicrotask(() => {
        isApplyingExternalContentRef.current = false;
      });
    }
  }, []);

  useEffect(() => {
    if (!editor) return;
    const { content, saveMode } = deriveContent(value);

    saveModeRef.current = settings.other.saveJson ? "json-string" : saveMode;

    let nextKey = "__empty__";
    if (content === null || content === "") {
      nextKey = "__empty__";
    } else if (typeof content === "string") {
      nextKey = `str:${content}`;
    } else {
      try {
        nextKey = `json:${JSON.stringify(content)}`;
      } catch {
        nextKey = "obj";
      }
    }

    const editorMatchesDerived = () => {
      if (content === null || content === "") {
        return editor.isEmpty;
      }
      if (typeof content === "string") {
        return editor.getHTML() === content;
      }
      try {
        return (
          JSON.stringify(editor.getJSON()) === JSON.stringify(content)
        );
      } catch {
        return false;
      }
    };

    // Same serialized `value` as last time is not enough: after a tab switch the
    // form can briefly reset while TipTap is cleared, so keys may match but the
    // editor is still empty (or vice versa).
    if (
      nextKey === lastValueKeyRef.current &&
      editorMatchesDerived()
    ) {
      return;
    }

    lastValueKeyRef.current = nextKey;

    if (content === null || content === "") {
      if (hydratedContentRef.current) {
        return;
      }
      setCurrentContent(content);
      runExternalEditorCommand(() => {
        editor.commands.clearContent(false);
      });
      lastEmittedValueRef.current = null;
      return;
    }

    const isFocused =
      typeof editor.isFocused === "function"
        ? editor.isFocused()
        : editor.view?.hasFocus?.();
    if (isFocused && Date.now() - lastEmittedAtRef.current < 300) {
      return;
    }

    if (editorMatchesDerived()) {
      return;
    }

    setCurrentContent(content);
    runExternalEditorCommand(() => {
      editor.commands.setContent(content, false);
    });
  }, [editor, value, settings.other.saveJson, documentStatus, runExternalEditorCommand]);

  useEffect(() => {
    if (!editor) return;
    if (fallbackFetchedRef.current) return;
    if (value !== "" && value !== null && value !== undefined) return;

    const match = window.location.pathname.match(
      /content-manager\/collection-types\/([^/]+)\/([^/?]+)/
    );
    if (!match) return;

    const [, contentType, documentId] = match;
    const searchParams = new URLSearchParams(window.location.search);
    const locale =
      searchParams.get("locale") ||
      searchParams.get("plugins[i18n][locale]") ||
      undefined;

    fallbackFetchedRef.current = true;

    const fetchClient = getFetchClient();
    const params = {
      status: documentStatus,
      ...(locale ? { locale } : {}),
    };

    fetchClient
      .get(`/content-manager/collection-types/${contentType}/${documentId}`, {
        params,
      })
      .then((response) => {
        const entry = response?.data?.data;
        if (!entry) return;
        const rawValue = entry?.[name];
        const { content } = deriveContent(rawValue);
        if (!content) return;
        hydratedContentRef.current = true;
        setCurrentContent(content);
        runExternalEditorCommand(() => {
          editor.commands.setContent(content, false);
        });
      })
      .catch(() => {
        // Ignore fallback errors; core form still drives value updates.
      });
  }, [editor, name, value, documentStatus, runExternalEditorCommand]);

  return (
    <TooltipProvider>
      <Field.Root required={required}>
        <Stack spacing={1}>
          <Box>
            <Field.Label action={labelAction}>
              {" "}
              {formatMessageSafe(intlLabel, name)}
            </Field.Label>
          </Box>
          {editor && (
            <Editor
              key="editor"
              disabled={disabled}
              name={name}
              editor={editor}
              onChange={handleChange}
              value={value}
              settings={settings}
            />
          )}
          {error && (
            <Typography variant="pi" textColor="danger600">
              {formatMessage({ id: error, defaultMessage: error })}
            </Typography>
          )}
          {description && (
            <Typography variant="pi">
              {formatMessageSafe(description)}
            </Typography>
          )}
        </Stack>
      </Field.Root>
    </TooltipProvider>
  );
};

Wysiwyg.defaultProps = {
  description: "",
  disabled: false,
  error: undefined,
  intlLabel: "",
  required: false,
  value: "",
  settings: {},
};

Wysiwyg.propTypes = {
  description: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  intlLabel: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
  }),
  labelAction: PropTypes.object,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  settings: PropTypes.object,
};

export default Wysiwyg;

import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";

// TipTap Editor
import { BubbleMenu, EditorContent } from "@tiptap/react";
import { Toolbar } from "./Toolbar";

// Media library
import MediaLib from "../MediaLib";

// Layout
import { Box, Flex, IconButton, IconButtonGroup } from "@strapi/design-system";

import Wrapper from "./styles.js";

// Icons
import {
  AiOutlineDelete,
  AiOutlineDeleteColumn,
  AiOutlineDeleteRow,
  AiOutlineInsertRowAbove,
  AiOutlineInsertRowBelow,
  AiOutlineInsertRowLeft,
  AiOutlineInsertRowRight,
  AiOutlineMergeCells,
  AiOutlineSplitCells,
} from "react-icons/ai";

const TableMenuBar = (editor) => {
  return (
    <Fragment key="tableMenubar">
      <IconButtonGroup className="button-group">
        <IconButton
          label="Insert row below"
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          <AiOutlineInsertRowBelow />
        </IconButton>
        <IconButton
          label="Insert row above"
          onClick={() => editor.chain().focus().addRowBefore().run()}
        >
          <AiOutlineInsertRowAbove />
        </IconButton>

        <IconButton
          label="Insert Column to the left"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
        >
          <AiOutlineInsertRowLeft />
        </IconButton>

        <IconButton
          label="Insert Column to the right"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          <AiOutlineInsertRowRight />
        </IconButton>
      </IconButtonGroup>

      <IconButtonGroup className="button-group">
        <IconButton
          label="Delete row"
          onClick={() => editor.chain().focus().deleteRow().run()}
        >
          <AiOutlineDeleteRow />
        </IconButton>
        <IconButton
          label="Delete column"
          onClick={() => editor.chain().focus().deleteColumn().run()}
        >
          <AiOutlineDeleteColumn />
        </IconButton>
      </IconButtonGroup>

      <IconButtonGroup className="button-group">
        <IconButton
          label="Merge cells"
          onClick={() => editor.chain().focus().mergeCells().run()}
        >
          <AiOutlineMergeCells />
        </IconButton>
        <IconButton
          label="Split cells"
          onClick={() => editor.chain().focus().splitCell().run()}
        >
          <AiOutlineSplitCells />
        </IconButton>
      </IconButtonGroup>

      <IconButtonGroup className="button-group">
        <IconButton
          label="Delete table"
          onClick={() => {
            if (window.confirm("Are you sure you want to delete the table?")) {
              editor.chain().focus().deleteTable().run();
            }
          }}
        >
          <AiOutlineDelete />
        </IconButton>
      </IconButtonGroup>
    </Fragment>
  );
};

// Floating bubble menu for table
const BubbleMenuComponent = ({ editor, toggleMediaLib }) => {
  if (editor) {
    let menuBars = [];

    if (editor.isActive("table")) {
      menuBars.push(TableMenuBar(editor));
    }

    return (
      <BubbleMenu
        editor={editor}
        tippyOptions={{ zIndex: 2, maxWidth: "450px" }}
      >
        {menuBars.length ? (
          <Flex
            padding={2}
            className="menu-bar floating"
            style={{ flexWrap: "wrap" }}
          >
            {/* Render menu bars */}
            {menuBars}
          </Flex>
        ) : null}
      </BubbleMenu>
    );
  }
  return null;
};

const Editor = ({ onChange, name, value, editor, disabled, settings }) => {
  // Media library handling
  const [mediaLibVisible, setMediaLibVisible] = useState(false);
  const [forceInsert, setForceInsert] = useState(false);
  const handleToggleMediaLib = () => setMediaLibVisible((prev) => !prev);

  const getUpdatedImage = (asset) => ({
    src: asset.url,
    alt: asset.alt,
    ...(asset.width && { width: asset.width }),
    ...(asset.height && { height: asset.height }),
    ...(asset.url?.includes("lazy") ||
      (asset.caption === "lazy" && { loading: "lazy" })),
  });

  const getUpdatedVideo = (asset, settings) => ({
    src: asset.url,
    ...(asset.ext === ".webm" && { type: "video/webm" }),
    ...(asset.ext === ".mp4" && { type: "video/mp4" }),
    // Provide a secondary source if available via alternativeFormats
    ...(asset.formats?.mp4?.url && {
      src2: asset.formats.mp4.url,
      type2: "video/mp4",
    }),
    ...(asset.width && { width: asset.width }),
    ...(asset.height && { height: asset.height }),
    controls: settings?.video?.controls,
    autoplay: settings?.video?.autoplay,
    loop: settings?.video?.loop,
    muted: settings?.video?.muted,
    playsinline: settings?.video?.playsinline,
  });

  const handleChangeAssets = (assets) => {
    if (
      !forceInsert &&
      (editor.isActive("image") || editor.isActive("video"))
    ) {
      assets.map((asset) => {
        if (asset.mime.includes("image")) {
          editor.chain().focus().setImage(getUpdatedImage(asset)).run();
        }
        if (asset.mime.includes("video")) {
          editor
            .chain()
            .focus()
            .setVideo(getUpdatedVideo(asset, settings))
            .run();
        }
      });
    } else {
      assets.map((asset) => {
        if (asset.mime.includes("image")) {
          editor.commands.setImage(getUpdatedImage(asset));
        }
        if (asset.mime.includes("video")) {
          editor.commands.setVideo(getUpdatedVideo(asset, settings));
        }
      });
    }

    setForceInsert(false);
    handleToggleMediaLib();
  };

  // Wait till we have the settings before showing the editor
  if (!settings) {
    return null;
  }

  return (
    <Wrapper>
      <Box
        hasRadius={true}
        overflow={"hidden"}
        borderWidth="1px"
        borderStyle="solid"
        borderColor="neutral200"
      >
        <Toolbar
          editor={editor}
          toggleMediaLib={handleToggleMediaLib}
          settings={settings}
        />
        <BubbleMenuComponent
          editor={editor}
          toggleMediaLib={handleToggleMediaLib}
        />

        <Box
          padding={2}
          background="neutral0"
          maxHeight={"600px"}
          style={{ resize: "vertical", overflow: "auto" }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>

      {settings.other && settings.other.wordcount ? (
        <Box marginTop={"5px"} color="neutral600">
          {editor.storage.characterCount.words()}{" "}
          {editor.storage.characterCount.words() > 1 ? "words" : "word"}
        </Box>
      ) : null}

      <MediaLib
        isOpen={mediaLibVisible}
        onChange={handleChangeAssets}
        onToggle={handleToggleMediaLib}
      />
    </Wrapper>
  );
};

Editor.defaultProps = {
  value: "",
  disabled: false,
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  editor: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  settings: PropTypes.object,
};

export default Editor;

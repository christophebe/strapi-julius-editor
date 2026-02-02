import {
  Field,
  Grid,
  SingleSelect,
  SingleSelectOption,
  Textarea,
  TextInput,
} from "@strapi/design-system";
import { NodeViewWrapper } from "@tiptap/react";
import { useEffect, useState } from "react";
import { getSettings } from "../../../utils/api";
import { mergeDeep } from "../utils/merge";
import defaultSettings from "../../../utils/defaults.admin.js";

const BlockComponent = (props) => {
  const [savedSettings, setSavedSettings] = useState(null);

  useEffect(() => {
    let isMounted = true;

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
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const settings = mergeDeep(
    JSON.parse(JSON.stringify(defaultSettings)),
    savedSettings ?? {}
  );
  const types = (settings.contentBlocks?.types ?? "")
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean)
    .sort();
  const position =
    typeof props.getPos === "function" ? props.getPos() : "block";
  const makeId = (suffix) => `cta-${position}-${suffix}`;

  const handleTypeChange = (value) => {
    props.updateAttributes({
      type: value,
    });
  };

  const handleTextareaChange = (value) => {
    props.updateAttributes({
      text: value,
    });
  };

  const handleLinkText = (value) => {
    props.updateAttributes({
      link_text: value,
    });
  };

  const handleLinkUrl = (value) => {
    props.updateAttributes({
      link_url: value,
    });
  };

  const handleTitle = (value) => {
    props.updateAttributes({
      title: value,
    });
  };

  return (
    <NodeViewWrapper className="react-component">
      <Grid.Root
        gap={{
          desktop: 5,
          tablet: 2,
          mobile: 1,
        }}
        gridCols={12}
        background="neutral100"
      >
        <Grid.Item background="neutral100" padding={2} col={3} s={12}>
          <Field.Root
            id={makeId("type")}
            name="type"
            required
            style={{ width: "100%" }}
          >
            <Field.Label>Type</Field.Label>
            <SingleSelect
              id={makeId("type")}
              required
              placeholder="Select a type"
              onChange={handleTypeChange}
              value={props.node.attrs.type || undefined}
              aria-label="Type"
              style={{ width: "100%" }}
            >
              {types.map((type) => (
                <SingleSelectOption key={type} value={type}>
                  {type}
                </SingleSelectOption>
              ))}
            </SingleSelect>
          </Field.Root>
        </Grid.Item>
        <Grid.Item background="neutral100" padding={2} col={9} s={12}>
          <Field.Root
            id={makeId("title")}
            name="title"
            style={{ width: "100%" }}
          >
            <Field.Label>Title</Field.Label>
            <TextInput
              id={makeId("title")}
              onChange={(e) => handleTitle(e.target.value)}
              value={props.node.attrs.title}
              style={{ width: "100%" }}
            />
          </Field.Root>
        </Grid.Item>
        <Grid.Item background="neutral100" padding={2} col={12} s={12}>
          <Field.Root
            id={makeId("text")}
            name="text"
            style={{ width: "100%" }}
          >
            <Field.Label>Text</Field.Label>
            <Textarea
              id={makeId("text")}
              onChange={(e) => handleTextareaChange(e.target.value)}
              value={props.node.attrs.text}
              resizable
              style={{ width: "100%" }}
            />
          </Field.Root>
        </Grid.Item>
        <Grid.Item background="neutral100" padding={3} col={6} s={12}>
          <Field.Root
            id={makeId("link-text")}
            name="link_text"
            style={{ width: "100%" }}
          >
            <Field.Label>Link text</Field.Label>
            <TextInput
              id={makeId("link-text")}
              onChange={(e) => handleLinkText(e.target.value)}
              value={props.node.attrs.link_text}
              style={{ width: "100%" }}
            />
          </Field.Root>
        </Grid.Item>
        <Grid.Item background="neutral100" padding={3} col={6} s={12}>
          <Field.Root
            id={makeId("link-url")}
            name="link_url"
            style={{ width: "100%" }}
          >
            <Field.Label>Link URL</Field.Label>
            <TextInput
              id={makeId("link-url")}
              onChange={(e) => handleLinkUrl(e.target.value)}
              value={props.node.attrs.link_url}
              style={{ width: "100%" }}
            />
          </Field.Root>
        </Grid.Item>
      </Grid.Root>
    </NodeViewWrapper>
  );
};

export default BlockComponent;

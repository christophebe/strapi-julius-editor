import { Box, Flex, Grid, GridItem, SingleSelect,  SingleSelectOption,  Textarea, TextInput, Typography } from "@strapi/design-system";
import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";

const BlocComponent = (props) => {

  //const [selectedType, setSelectedType] = useState(props.node.attrs.type);
  const handleTypeChange = (value) => {
    //setSelectedType(value);
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
  }

  const handleLinkUrl = (value) => {
    props.updateAttributes({
      link_url: value,
    });
  }

  const handleTitle = (value) => {
    props.updateAttributes({
      title: value,
    });
  }

  return (
    <NodeViewWrapper className="react-component">
      <Grid
        gap={{
          desktop: 5,
          tablet: 2,
          mobile: 1,
        }}
        background="neutral100"
      >
        <GridItem background="neutral100" padding={2} col={3} s={12}>
          <SingleSelect
            label="Type"
            required
            placeholder="Select a type"
            onChange={handleTypeChange}
            value={props.node.attrs.type}
          >
            <SingleSelectOption value="info">Info</SingleSelectOption>
            <SingleSelectOption value="reminder">Reminder</SingleSelectOption>
            <SingleSelectOption value="good-to-know">
              Good to known
            </SingleSelectOption>
          </SingleSelect>
        </GridItem>
        <GridItem background="neutral100" padding={2} col={9} s={12}>
          <TextInput
            label="Title"
            onChange={(e) => handleTitle(e.target.value)}
            value={props.node.attrs.title}
          />
        </GridItem>
        <GridItem background="neutral100" padding={2} col={12} s={12}>
          <Textarea
            label="Text"
            onChange={(e) => handleTextareaChange(e.target.value)}
            value={props.node.attrs.text}
          />
        </GridItem>
        <GridItem background="neutral100" padding={3} col={4} s={12}>
          <TextInput
            label="Link text"
            onChange={(e) => handleLinkText(e.target.value)}
            value={props.node.attrs.link_text}
          />
        </GridItem>
        <GridItem background="neutral100" padding={3} col={8} s={12}>
          <TextInput
            label="Link URL"
            onChange={(e) => handleLinkUrl(e.target.value)}
            value={props.node.attrs.link_url}
          />
        </GridItem>
      </Grid>
    </NodeViewWrapper>
  );
};

export default BlocComponent;

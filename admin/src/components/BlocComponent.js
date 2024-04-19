import { Box, SingleSelect,  SingleSelectOption,  Textarea, TextInput, Typography } from "@strapi/design-system";
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

  return (
    <NodeViewWrapper className="react-component">
      <Box background="neutral100" padding={4}>
        <Typography textColor="neutral800" style={{ fontWeight: "bold" }}>
          Content Bloc
        </Typography>

        <Box paddingTop={4}>
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
        </Box>
        <Box paddingTop={4}>
          <Textarea
            paddingTop={4}
            required
            width="100%"
            height="100px"
            label="Content"
            onChange={(e) => handleTextareaChange(e.target.value)}
          >
            {props.node.attrs.text}
          </Textarea>
        </Box>
        <Box paddingTop={4}>
          <TextInput
            label="Link Text"
            onChange={(e) => handleLinkText(e.target.value)}
            value={props.node.attrs.link_text}
          />
        </Box>
        <Box paddingTop={4}>
          <TextInput
            label="Link URL"
            onChange={(e) => handleLinkUrl(e.target.value)}
            value={props.node.attrs.link_url}
          />
        </Box>
      </Box>
    </NodeViewWrapper>
  );
};

export default BlocComponent;



      // {
      //   /* <div style={{ backgroundColor: "lightgray", padding: "10px" }}>
      //   <span className="label">Content Bloc</span>
      //   <div className="content">
      //     <select
      //       style={{ marginBottom: "20px" }}
      //       onChange={handleTypeChange}
      //       value={props.node.attrs.type}
      //     >
      //       <option value="info">Info</option>
      //       <option value="reminder">Reminder</option>
      //       <option value="good-to-know">Good to known</option>
      //     </select>
      //     <textarea
      //       style={{ width: "100%", height: "100px", marginBottom: "20px" }}
      //       onChange={handleTextareaChange}
      //     >
      //       {props.node.attrs.text}
      //     </textarea>
      //   </div>
      // </div> */
      // }
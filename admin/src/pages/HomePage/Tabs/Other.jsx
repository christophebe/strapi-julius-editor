import React, { Fragment } from "react";
import { Box, Typography, TextInput } from "@strapi/design-system";
import GridLayout from "../../../components/GridLayout";
import ToggleInput from "../../../components/ToggleInput";

export default ({ values, handleChange }) => {
  const wordcount = values.other && values.other.wordcount;

  return (
    <Fragment>
      <Box marginBottom={"1rem"}>
        <Typography variant={"beta"}>Content Block</Typography>
      </Box>

      <GridLayout>
        <Box marginTop={"1rem"} marginBottom={"2rem"}>
          <TextInput
            label="Block Content Types"
            type="text"
            placeholder="Add a list here, comma separated"
            name="rel"
            onChange={(e) =>
              handleChange({
                target: {
                  name: "contentBlocks.types",
                  value: e.target.value,
                },
              })
            }
            value={values.contentBlocks.types}
            aria-label="The list of block content types"
          />
        </Box>
      </GridLayout>

      <Box marginBottom={"1rem"}>
        <Typography variant={"beta"}>Other</Typography>
      </Box>

      <GridLayout>
        <Box>
          <ToggleInput
            label="Word count"
            hint="Show a word counter under the editor"
            size="S"
            name="other.wordcount"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={wordcount}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "other.wordcount",
                  value: !wordcount,
                },
              })
            }
          />
        </Box>
      </GridLayout>

      <Box marginTop={"2rem"} marginBottom={"1rem"}></Box>

      <GridLayout>
        <Box>
          <ToggleInput
            label="Save content as JSON"
            hint="Save editor content as JSON instead of raw HTML. NOTE: You will have to save pages again, as changing this setting will NOT auto update you currently saved content"
            size="S"
            name="other.saveJson"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={values.other.saveJson}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "other.saveJson",
                  value: !values.other.saveJson,
                },
              })
            }
          />
        </Box>
      </GridLayout>

      <Box marginTop={"2rem"} marginBottom={"1rem"}></Box>
    </Fragment>
  );
};

import React, { Fragment } from "react";
import { Box } from "@strapi/design-system/Box";
import { GridLayout } from "@strapi/design-system/Layout";
import { ToggleInput } from "@strapi/design-system/ToggleInput";
import { Typography } from "@strapi/design-system/Typography";
import { TextInput } from "@strapi/design-system";

export default ({ values, handleChange }) => {
  const wordcount = values.other && values.other.wordcount;
  const defaultAlign = values.defaultAlign;
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
        <Typography variant={"beta"}>Default Align</Typography>
      </Box>

      <GridLayout>
        <Box marginTop={"1rem"} marginBottom={"2rem"}>
          <ToggleInput
            label="Default Align"
            hint="Set the default alignment for the editor"
            size="S"
            name="defaultAlign"
            onLabel="Left"
            offLabel="Right"
            checked={defaultAlign === "left"}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "defaultAlign",
                  value: defaultAlign === "left" ? "right" : "left",
                },
              })
            }
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

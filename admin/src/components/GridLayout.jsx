import React from "react";
import { Grid } from "@strapi/design-system";

const GridLayout = ({ children, ...props }) => {
  return (
    <Grid.Root gap={4} gridCols={4} {...props}>
      {children}
    </Grid.Root>
  );
};

export default GridLayout;

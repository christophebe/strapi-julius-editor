import React from "react";
import { Flex } from "@strapi/design-system";

const Stack = ({ spacing = 2, horizontal = false, ...props }) => {
  return (
    <Flex direction={horizontal ? "row" : "column"} gap={spacing} {...props} />
  );
};

export default Stack;

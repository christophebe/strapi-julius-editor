import React from "react";
import { Field, Toggle } from "@strapi/design-system";

const ToggleInput = ({ label, hint, labelAction, ...rest }) => {
  return (
    <Field.Root hint={hint}>
      <Field.Label action={labelAction}>{label}</Field.Label>
      <Toggle {...rest} />
      <Field.Hint />
      <Field.Error />
    </Field.Root>
  );
};

export default ToggleInput;

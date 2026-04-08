import * as React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";

/**
 * This component is a placeholder for FormControl to correctly set the shrink label state on SSR.
 */
function SSRInitialFilled(_: BaseNumberField.Root.Props) {
  return null;
}
SSRInitialFilled.muiName = "Input";

export default function NumberField({
  id: idProp,
  label,
  error,
  size = "medium",
  ...other
}: BaseNumberField.Root.Props & {
  label?: React.ReactNode;
  size?: "small" | "medium";
  error?: boolean;
}) {
  let id = React.useId();
  if (idProp) {
    id = idProp;
  }
  return (
    <BaseNumberField.Root
      {...other}
      render={(props, state) => (
        <FormControl
          fullWidth
          size={size}
          ref={props.ref}
          disabled={state.disabled}
          required={state.required}
          error={error}
          variant="outlined"
        >
          {props.children}
        </FormControl>
      )}
    >
      <SSRInitialFilled {...other} />
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <BaseNumberField.Input
        id={id}
        render={(props, state) => (
          <OutlinedInput
            label={label}
            inputRef={props.ref}
            value={state.inputValue}
            onBlur={props.onBlur}
            onChange={props.onChange}
            onKeyUp={props.onKeyUp}
            onKeyDown={props.onKeyDown}
            onFocus={props.onFocus}
            slotProps={{
              input: props,
            }}
            sx={{ pr: 0 }}
          />
        )}
      />
    </BaseNumberField.Root>
  );
}

import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { useTheme } from "../providers/Theming";
import { useStyles } from "../hooks/use-styles";

const SearchTextInput = React.forwardRef<
  TextInput,
  Omit<
    React.ComponentProps<typeof TextInput>,
    | "numberOfLines"
    | "clearButtonMode"
    | "placeholderTextColor"
    | "placeholder"
    | "numberOfLines"
  >
>(function SearchTextInput(props, ref) {
  const theme = useTheme();
  const styles = useStyles((theme) => ({
    root: {
      ...theme.typography.body,
      width: "100%",
      padding: theme.units.medium,
      backgroundColor: theme.colors.backgroundAccent,
      borderRadius: theme.constants.borderRadius,
      borderColor: theme.colors.backgroundAccent,
      height:
        Number(theme.typography.body.lineHeight || 0) + theme.units.medium * 2,
    },
  }));

  return (
    <TextInput
      clearButtonMode="while-editing"
      placeholderTextColor={theme.colors.foregroundSecondary}
      placeholder="thoughts or tags"
      numberOfLines={2}
      editable
      {...props}
      style={[styles.root, props.style]}
      ref={ref}
    />
  );
});

export { SearchTextInput };

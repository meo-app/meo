import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { useStyles } from "../hooks/use-styles";
import { useTheme } from "../application/providers/Theming";

function SearchTextInput(
  props: Omit<
    React.ComponentProps<typeof TextInput>,
    | "numberOfLines"
    | "clearButtonMode"
    | "placeholderTextColor"
    | "placeholder"
    | "numberOfLines"
    | "style"
  >
) {
  const theme = useTheme();
  const styles = useStyles((theme) => ({
    root: {
      ...theme.typography.body,
      width: "100%",
      padding: theme.units.medium,
      backgroundColor: theme.colors.backgroundAccent,
      borderRadius: theme.constants.borderRadius,
      borderColor: theme.colors.backgroundAccent,
      borderWidth: 1,
      height:
        Number(theme.typography.body.lineHeight || 0) + theme.units.medium * 2,
    },
  }));

  return (
    <TextInput
      clearButtonMode="always"
      placeholderTextColor={theme.colors.foregroundSecondary}
      placeholder="thoughts or tags"
      numberOfLines={2}
      style={styles.root}
      editable
      {...props}
    />
  );
}

export { SearchTextInput };

import { StyleSheet } from "react-native";
import { useTheme } from "../providers/Theming";
import { ViewStyle, TextStyle, ImageStyle } from "react-native";
import { useMemo } from "react";

// TODO: useStyles needs optimization, create is being called on every render
function useStyles<
  T extends { [key: string]: ViewStyle | TextStyle | ImageStyle }
>(fn: (theme: ReturnType<typeof useTheme>) => T) {
  const theme = useTheme();
  return useMemo(() => {
    return StyleSheet.create(fn(theme));
  }, [fn, theme]);
}

export { useStyles };

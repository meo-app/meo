import { StyleSheet } from "react-native";
import { useTheme } from "../application/providers/Theming";
import { ViewStyle, TextStyle, ImageStyle } from "react-native";
import { useMemo } from "react";

function useStyles<
  T extends { [key: string]: ViewStyle | TextStyle | ImageStyle }
>(fn: (theme: ReturnType<typeof useTheme>) => T) {
  const theme = useTheme();
  return useMemo(() => {
    return StyleSheet.create(fn(theme));
  }, [fn, theme]);
}

export { useStyles };

import assert from "assert";
import { useContext } from "react";
import { Theme } from "../../../foundations/Theme";
import { ThemingContext } from "../Theming";

function useTheme(): Theme {
  const theme = useContext(ThemingContext);
  assert(theme, "Theme not found. Missing <ThemeProvider />?");
  return theme;
}

export { useTheme };

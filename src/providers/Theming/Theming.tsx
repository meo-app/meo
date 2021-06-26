import React, { useEffect, useState } from "react";
import {
  ColorSchemeName,
  Platform,
  StatusBar,
  StatusBarStyle,
  useColorScheme,
} from "react-native";
import { Theme } from "../../foundations/Theme";
import { usePreferredAccentColorQuery } from "../../hooks/use-preferred-accent-color";
import { usePreferredColorSchemeQuery } from "../../hooks/use-preferred-color-scheme-query";
import { APP_COLORS, APP_CONSTANTS } from "./app-theme-definition";
import { useResponsiveScales } from "./hooks/use-responsive-scales";
import { useResponsiveTypography } from "./hooks/use-responsive-typography";
import { useResponsiveUnits } from "./hooks/use-responsive-units";

const STATUSBAR_BACKGROUND_COLOR = "rgba(0,0,0,0)";

if (Platform.OS === "android") {
  StatusBar.setBackgroundColor(STATUSBAR_BACKGROUND_COLOR);
  StatusBar.setTranslucent(true);
}

const STATUS_BAR_SCHEME_MAP: { [key in "light" | "dark"]: StatusBarStyle } = {
  dark: "light-content",
  light: "dark-content",
};

const DEFAULT_COLOR_SCHEME = "light";
const Context = React.createContext<Theme | null>(null);

interface Props extends Partial<Omit<Theme, "colors">> {
  /** Force the colorscheme to dark or light  */
  forceColorSchemeTo?: ColorSchemeName;

  /** Handle status bar colors and background */
  handleStatusBar?: boolean;

  /** Color definition for both light and dark themes */
  colors?: Record<"light" | "dark", Theme["colors"]>;
}

const ThemeProvider: React.FunctionComponent<Props> = function ThemeProvider({
  children,
  forceColorSchemeTo,
  handleStatusBar = true,
  colors = APP_COLORS,
  constants = APP_CONSTANTS,
  ...props
}) {
  const systemColorScheme = useColorScheme();
  const defaultScales = useResponsiveScales();
  const defaultUnits = useResponsiveUnits();
  const defaultTypography = useResponsiveTypography();
  const { data: preferredColorScheme } = usePreferredColorSchemeQuery();
  const [scheme, setColorScheme] = useState<NonNullable<ColorSchemeName>>(
    DEFAULT_COLOR_SCHEME
  );

  const scales = props.scales ? props.scales : defaultScales;
  const units = props.units ? props.units : defaultUnits;
  const typography = props.typography ? props.typography : defaultTypography;

  useEffect(() => {
    if (["light", "dark"].includes(String(preferredColorScheme))) {
      setColorScheme(preferredColorScheme as "light" | "dark");
    } else if (systemColorScheme) {
      setColorScheme(systemColorScheme);
    }
  }, [preferredColorScheme, scheme, systemColorScheme]);

  useEffect(() => {
    if (!handleStatusBar) {
      return;
    }
    StatusBar.setBarStyle(STATUS_BAR_SCHEME_MAP[scheme]);
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(STATUSBAR_BACKGROUND_COLOR);
      StatusBar.setTranslucent(true);
    }
  }, [handleStatusBar, scheme]);

  const { foregroundPrimary } = colors[forceColorSchemeTo || scheme];
  const { data: accentColor } = usePreferredAccentColorQuery();
  const colorScheme = colors[forceColorSchemeTo || scheme];
  return (
    <Context.Provider
      value={{
        constants,
        units,
        scales,
        colors: {
          ...colorScheme,
          primary: accentColor ? accentColor : colorScheme.primary,
        },
        typography: {
          body: Object.assign({}, typography.body, {
            color: foregroundPrimary,
          }),
          highlight: Object.assign({}, typography.highlight, {
            color: foregroundPrimary,
          }),
          display: Object.assign({}, typography.display, {
            color: foregroundPrimary,
          }),
          caption: Object.assign({}, typography.caption, {
            color: foregroundPrimary,
          }),
          subtitle: Object.assign({}, typography.subtitle, {
            color: foregroundPrimary,
          }),
          strong: Object.assign({}, typography.strong, {
            color: foregroundPrimary,
          }),
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export {
  ThemeProvider,
  Context as ThemingContext,
  STATUSBAR_BACKGROUND_COLOR,
  STATUS_BAR_SCHEME_MAP,
};

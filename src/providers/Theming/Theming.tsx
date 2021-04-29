import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import React, { useContext, useEffect, useState } from "react";
import {
  ColorSchemeName,
  Platform,
  StatusBar,
  StatusBarStyle,
  useColorScheme,
} from "react-native";
import { Theme } from "../../foundations/Theme";
import { usePreferredColorSchemeQuery } from "../../hooks/use-preferred-color-scheme-query";
import { assert } from "../../shared/assert";
import { useResponsiveScales } from "./hooks/use-responsive-scales";
import { useResponsiveTypography } from "./hooks/use-responsive-typography";

/**
 * TODO:
 * - [x] Responsive font size
 * - [ ] File seems too cluttered, break it down (Theme definition should leave outside of theming provider)
 * - [ ] Finally load fonts on App.tsx
 */

const STATUSBAR_BACKGROUND_COLOR = "rgba(0,0,0,0)";

if (Platform.OS === "android") {
  StatusBar.setBackgroundColor(STATUSBAR_BACKGROUND_COLOR);
  StatusBar.setTranslucent(true);
}

const absoluteDark = "#000";
const absoluteLight = "#FFF";
const primary = "#2D9CDB";
const destructive = "#FC5B10";
const light: Theme["colors"] = {
  absoluteDark,
  absoluteLight,
  primary,
  destructive,
  background: "#FFFFFF",
  backgroundAccent: "#f2f2f2",
  foregroundPrimary: "#4F4F4F",
  foregroundSecondary: "#9A99A2",
};

const dark: Theme["colors"] = {
  absoluteDark,
  absoluteLight,
  primary,
  destructive,
  background: "#1D222D",
  backgroundAccent: "#292F3F",
  foregroundPrimary: "#F2F2F2",
  foregroundSecondary: "#9A99A2",
};

const base: Pick<Theme, "units" | "constants"> = {
  constants: {
    borderRadius: 12,
    absoluteRadius: 999,
    shadow: {
      elevation: 2,
      position: "relative",
      shadowColor: absoluteDark,
      shadowOffset: {
        width: 0,
        height: 0.5,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
  },
  units: {
    smallest: 2,
    smaller: 4,
    small: 8,
    medium: 16,
    large: 24,
    larger: 36,
    largest: 48,
  },
};

const colors: { [key in "light" | "dark"]: Theme["colors"] } = {
  light,
  dark,
};

const STATUS_BAR_SCHEME_MAP: { [key in "light" | "dark"]: StatusBarStyle } = {
  dark: "light-content",
  light: "dark-content",
};

const DEFAULT_COLOR_SCHEME = "light";
const Context = React.createContext<Theme | null>(null);

const ThemeProvider: React.FunctionComponent<{
  forceColorSchemeTo?: ColorSchemeName;
  handleStatusBar?: boolean;
}> = function ThemeProvider({
  children,
  forceColorSchemeTo,
  handleStatusBar = true,
}) {
  const systemColorScheme = useColorScheme();
  const scales = useResponsiveScales();
  const typography = useResponsiveTypography();
  const { data } = usePreferredColorSchemeQuery();
  const [scheme, setColorScheme] = useState<NonNullable<ColorSchemeName>>(
    DEFAULT_COLOR_SCHEME
  );

  useEffect(() => {
    if (["light", "dark"].includes(String(data))) {
      setColorScheme(data as "light" | "dark");
    } else if (systemColorScheme) {
      setColorScheme(systemColorScheme);
    }
  }, [data, scheme, systemColorScheme]);

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

  // TODO: load it on splashscreen
  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const { foregroundPrimary } = colors[forceColorSchemeTo || scheme];

  return (
    <Context.Provider
      value={{
        ...base,
        scales,
        colors: colors[forceColorSchemeTo || scheme],
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

function useTheme(): Theme {
  const theme = useContext(Context);
  assert(theme, "Theme not found. Missing <ThemeProvider />?");
  return theme;
}

const FlipColorScheme: React.FunctionComponent = function FlipColorScheme({
  children,
}) {
  const { data } = usePreferredColorSchemeQuery();
  const systemColorScheme = useColorScheme();

  return (
    <ThemeProvider
      handleStatusBar={false}
      {...(systemColorScheme && {
        forceColorSchemeTo: systemColorScheme === "dark" ? "light" : "dark",
      })}
      {...(data !== "system" && {
        forceColorSchemeTo: data === "dark" ? "light" : "dark",
      })}
    >
      {children}
    </ThemeProvider>
  );
};

export {
  ThemeProvider,
  useTheme,
  FlipColorScheme,
  STATUSBAR_BACKGROUND_COLOR,
  STATUS_BAR_SCHEME_MAP,
};

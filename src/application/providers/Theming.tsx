import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import React, { useContext, Children } from "react";
import { StatusBar, StatusBarStyle, View } from "react-native";
import { ColorSchemeName, useColorScheme } from "react-native-appearance";
import { Units } from "../../foundations/Spacing";
import { Theme } from "../../foundations/Theme";

const absoluteDark = "#000";
const absoluteLight = "#FFF";
const primary = "#2D9CDB";
const light: Theme["colors"] = {
  absoluteDark,
  absoluteLight,
  primary,
  background: "#FFFFFF",
  backgroundAccent: "#f2f2f2",
  foregroundPrimary: "#4F4F4F",
  foregroundSecondary: "#9A99A2",
};

const dark: Theme["colors"] = {
  absoluteDark,
  absoluteLight,
  primary,
  background: "#1D222D",
  backgroundAccent: "#292F3F",
  foregroundPrimary: "#F2F2F2",
  foregroundSecondary: "#9A99A2",
};

const base: Pick<Theme, "scales" | "typography" | "units" | "constants"> = {
  constants: {
    borderRadius: 12,
    absoluteRadius: 999,
    shadow: {
      elevation: 2,
      position: "relative",
      shadowColor: absoluteDark,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 0.9,
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
  scales: {
    smallest: 8,
    smaller: 12,
    small: 16,
    medium: 24,
    large: 32,
    larger: 48,
    largest: 64,
  },
  typography: {
    body: {
      fontFamily: "Inter_400Regular",
      fontSize: 16,
      lineHeight: 22,
    },
    display: {
      fontFamily: "Inter_700Bold",
      fontSize: 24,
      lineHeight: 28,
    },
    caption: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      lineHeight: 16,
    },
  },
};

const colors: { [key in ColorSchemeName]: Theme["colors"] } = {
  "no-preference": light,
  light,
  dark,
};

const STATUS_BAR_SCHEME_MAP: { [key in ColorSchemeName]: StatusBarStyle } = {
  "no-preference": "default",
  dark: "light-content",
  light: "dark-content",
};

const Context = React.createContext<Theme | null>(null);
const ThemeProvider: React.FunctionComponent<{
  forceColorSchemeTo?: ColorSchemeName;
  forceStatusBarTo?: ColorSchemeName;
}> = function ThemeProvider({
  children,
  forceColorSchemeTo,
  forceStatusBarTo,
}) {
  const systemColorScheme = useColorScheme();
  const scheme = forceColorSchemeTo || systemColorScheme;
  const statusBarScheme = forceStatusBarTo || scheme;
  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const { foregroundPrimary } = colors[scheme];

  return (
    <Context.Provider
      value={{
        ...base,
        colors: colors[scheme],
        typography: {
          body: Object.assign({}, base.typography.body, {
            color: foregroundPrimary,
          }),
          display: Object.assign({}, base.typography.display, {
            color: foregroundPrimary,
          }),
          caption: Object.assign({}, base.typography.caption, {
            color: foregroundPrimary,
          }),
        },
      }}
    >
      <StatusBar
        barStyle={STATUS_BAR_SCHEME_MAP[statusBarScheme]}
        backgroundColor={colors[statusBarScheme].background}
      />
      {children}
    </Context.Provider>
  );
};

function useTheme(): Theme {
  const theme = useContext(Context);
  if (!theme) {
    throw new Error("Theme not found. Missing <ThemeProvider />?");
  }
  return theme;
}

/**
 * Note: Edges can have variants based on device/screen size etc
 */
function useEdgeSpacing(): {
  vertical: keyof Units;
  horizontal: keyof Units;
} {
  return {
    vertical: "large",
    horizontal: "medium",
  };
}

const FlipColorScheme: React.FunctionComponent = function FlipColorScheme({
  children,
}) {
  const scheme = useColorScheme();
  return (
    <ThemeProvider
      {...(scheme !== "no-preference" && {
        forceColorSchemeTo: scheme === "dark" ? "light" : "dark",
      })}
    >
      {children}
    </ThemeProvider>
  );
};

export { ThemeProvider, useTheme, useEdgeSpacing, FlipColorScheme };

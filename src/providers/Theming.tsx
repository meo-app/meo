import {
  Inter_400Regular,
  Inter_700Bold,
  Inter_500Medium,
  useFonts,
} from "@expo-google-fonts/inter";
import React, { useContext } from "react";
import {
  ColorSchemeName,
  Platform,
  StatusBar,
  StatusBarStyle,
  useColorScheme,
} from "react-native";
import { Units } from "../foundations/Spacing";
import { Theme } from "../foundations/Theme";

const STATUSBAR_BACKGROUND_COLOR = "rgba(0,0,0,0)";

if (Platform.OS === "android") {
  StatusBar.setBackgroundColor(STATUSBAR_BACKGROUND_COLOR);
  StatusBar.setTranslucent(true);
}

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
  scales: {
    smallest: 8,
    smaller: 16,
    small: 24,
    medium: 32,
    large: 48,
    larger: 64,
    largest: 128,
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
    subtitle: {
      fontFamily: "Inter_700Bold",
      fontSize: 20,
      lineHeight: 22,
    },
    caption: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      lineHeight: 16,
    },
    highlight: {
      fontFamily: "Inter_400Regular",
      fontSize: 20,
      lineHeight: 24,
    },
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

const Context = React.createContext<Theme | null>(null);
const ThemeProvider: React.FunctionComponent<{
  forceColorSchemeTo?: ColorSchemeName;
}> = function ThemeProvider({ children, forceColorSchemeTo }) {
  const systemColorScheme = useColorScheme();
  const scheme = forceColorSchemeTo || (systemColorScheme ?? "light");
  // TODO: load it on splashscreen
  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_400Regular,
    Inter_500Medium,
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
          highlight: Object.assign({}, base.typography.highlight, {
            color: foregroundPrimary,
          }),
          display: Object.assign({}, base.typography.display, {
            color: foregroundPrimary,
          }),
          caption: Object.assign({}, base.typography.caption, {
            color: foregroundPrimary,
          }),
          subtitle: Object.assign({}, base.typography.subtitle, {
            color: foregroundPrimary,
          }),
        },
      }}
    >
      <StatusBar
        barStyle={STATUS_BAR_SCHEME_MAP[systemColorScheme ?? "light"]}
        backgroundColor={STATUSBAR_BACKGROUND_COLOR}
        translucent
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

function usePaddingHorizontal() {
  const theme = useTheme();
  const paddingHorizontalUnit: keyof Units = "medium";
  return {
    paddingHorizontalUnit,
    paddingHorizontal: theme.units[paddingHorizontalUnit],
  };
}

const FlipColorScheme: React.FunctionComponent = function FlipColorScheme({
  children,
}) {
  const scheme = useColorScheme();
  return (
    <ThemeProvider
      {...(scheme && {
        forceColorSchemeTo: scheme === "dark" ? "light" : "dark",
      })}
    >
      {children}
    </ThemeProvider>
  );
};

export {
  ThemeProvider,
  useTheme,
  usePaddingHorizontal,
  FlipColorScheme,
  STATUSBAR_BACKGROUND_COLOR,
  STATUS_BAR_SCHEME_MAP,
};

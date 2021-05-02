import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Constants } from "../../foundations/Constants";
import { Scales, Units } from "../../foundations/Spacing";
import { Theme } from "../../foundations/Theme";
import { Typography } from "../../foundations/Typography";

/**
 * Colors that wont change between light and dark schemes
 */
const absoluteDark = "#000";
const absoluteLight = "#FFF";
const primary = "#2D9CDB";
const destructive = "#FC5B10";

const APP_COLORS: Record<"light" | "dark", Theme["colors"]> = {
  light: {
    absoluteDark,
    absoluteLight,
    primary,
    destructive,
    background: "#FFFFFF",
    backgroundAccent: "#f2f2f2",
    foregroundPrimary: "#4F4F4F",
    foregroundSecondary: "#9A99A2",
  },
  dark: {
    absoluteDark,
    absoluteLight,
    primary,
    destructive,
    background: "#1D222D",
    backgroundAccent: "#292F3F",
    foregroundPrimary: "#F2F2F2",
    foregroundSecondary: "#9A99A2",
  },
};

const APP_CONSTANTS: Constants = {
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
};

const APP_SCALES: Scales = {
  smallest: 8,
  smaller: 16,
  small: 24,
  medium: 32,
  large: 48,
  larger: 64,
  largest: 72,
};

/** * NOTE: Every font used on the app should be added here as
 * we are going to load it while splash screen is active
 */
const APP_FONTS = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
};

const APP_TYPOGRAPHY: Typography<keyof typeof APP_FONTS> = {
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
  strong: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
};

const APP_UNITS: Units = {
  smallest: 2,
  smaller: 4,
  small: 8,
  medium: 16,
  large: 24,
  larger: 36,
  largest: 48,
};

export {
  APP_COLORS,
  APP_CONSTANTS,
  APP_SCALES,
  APP_TYPOGRAPHY,
  APP_UNITS,
  APP_FONTS,
};

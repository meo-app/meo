import { StackHeaderProps } from "@react-navigation/stack";
import React, { useMemo } from "react";
import { Dimensions, Platform, StatusBar } from "react-native";
import { useEdgeSpacing, useTheme } from "../application/providers/Theming";
import { Font } from "./Font";
import { Frame } from "./Frame";

function useStatusBarHeight() {
  const layout = Dimensions.get("window");
  const isLandscape = layout.width > layout.height;
  return useMemo(() => {
    let headerHeight;
    if (Platform.OS === "ios") {
      if (isLandscape && !Platform.isPad) {
        headerHeight = 36;
      } else {
        headerHeight = 44;
      }
    } else if (Platform.OS === "android") {
      headerHeight = 56;
    } else {
      headerHeight = 64;
    }

    return headerHeight;
  }, [isLandscape]);
}

interface Props {
  title?: string;
}

const SafeHeader: React.FunctionComponent = function SafeHeader({ children }) {
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const statusBarHeight = useStatusBarHeight();
  return (
    <Frame
      style={{
        paddingLeft: theme.units[spacing.horizontal],
        paddingRight: theme.units[spacing.horizontal],
        backgroundColor: theme.colors.background,
        paddingBottom: statusBarHeight / 2,
        paddingTop: statusBarHeight,
        ...(Platform.OS === "android" && {
          paddingTop: statusBarHeight / 2,
        }),
        ...theme.constants.shadow,
      }}
    >
      {children}
    </Frame>
  );
};

function Header({ title }: Props) {
  return (
    <SafeHeader>
      <Font variant="display">{title}</Font>
    </SafeHeader>
  );
}

export { Header, SafeHeader };

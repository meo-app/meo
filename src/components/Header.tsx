import { rgba } from "polished";
import React, { useMemo } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePaddingHorizontal } from "../providers/Theming/hooks/use-padding-horizontal";
import { useTheme } from "../providers/Theming/Theming";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { OpenDrawerButton } from "./OpenDrawerButton";

interface Props {
  hideBackground?: boolean;
  title?: string | React.ReactNode;
}

const Header: React.FunctionComponent<Props> = function Header({
  title,
  children,
  hideBackground,
}) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { paddingHorizontal } = usePaddingHorizontal();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        backgrond: {
          display: "flex",
          backgroundColor: theme.colors.background,
          zIndex: 2,
          ...theme.constants.shadow,
        },
        spacer: {
          height: insets.top,
          width: "100%",
          backgroundColor: rgba(255, 255, 255, 0),
        },
        root: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal,
          paddingBottom: theme.units.large,
          paddingTop: theme.units.medium,
        },
      }),
    [
      insets.top,
      paddingHorizontal,
      theme.colors.background,
      theme.constants.shadow,
      theme.units.large,
      theme.units.medium,
    ]
  );

  return (
    <ImageBackground
      style={styles.backgrond}
      source={
        hideBackground ? null : require("../assets/bg-pattern-grayscale.png")
      }
    >
      <Frame style={styles.spacer} />
      <Frame style={styles.root}>
        {!children && title && (
          <Frame flexDirection="row">
            <OpenDrawerButton />
            <Font variant="display">{title}</Font>
          </Frame>
        )}
        {children}
      </Frame>
    </ImageBackground>
  );
};

export { Header };

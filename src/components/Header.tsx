import { rgba } from "polished";
import React from "react";
import { ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEdgeSpacing, useTheme } from "../application/providers/Theming";
import { useStyles } from "../hooks/use-styles";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { OpenDrawerButton } from "./OpenDrawerButton";

interface Props {
  hideBackground?: boolean;
  title?: string;
}

const Header: React.FunctionComponent<Props> = function Header({
  title,
  children,
  hideBackground,
}) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const styles = useStyles(() => ({
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
      paddingLeft: theme.units[spacing.horizontal],
      paddingRight: theme.units[spacing.horizontal],
      paddingBottom: theme.units.large,
      paddingTop: theme.units.medium,
    },
  }));

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

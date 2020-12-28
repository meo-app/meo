import { StackHeaderProps } from "@react-navigation/stack";
import { rgba } from "polished";
import React, { useCallback } from "react";
import { ImageBackground } from "react-native";
import { useEdgeSpacing, useTheme } from "../application/providers/Theming";
import { useStyles } from "../hooks/use-styles";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { OpenDrawerButton } from "./OpenDrawerButton";

interface Props extends StackHeaderProps {
  hideBackground?: boolean;
}

const Header: React.FunctionComponent<Props> = function Header({
  insets,
  scene,
  children,
  hideBackground,
}) {
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const styles = useStyles(() => ({
    backgrond: {
      display: "flex",
      backgroundColor: theme.colors.background,
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
  const Wrapper = useCallback<React.FunctionComponent>(
    ({ children: node }) => {
      if (hideBackground) {
        return <Frame style={styles.backgrond}>{children}</Frame>;
      }

      return (
        <ImageBackground
          source={require("../assets/bg-pattern-grayscale.png")}
          style={styles.backgrond}
        >
          {node}
        </ImageBackground>
      );
    },
    [children, hideBackground, styles.backgrond]
  );
  return (
    <Wrapper>
      <Frame style={styles.spacer} />
      <Frame style={styles.root}>
        {!children && (
          <Frame flexDirection="row">
            <OpenDrawerButton />
            <Font variant="display">{scene.route.name}</Font>
          </Frame>
        )}
        {children}
      </Frame>
    </Wrapper>
  );
};

export { Header };

import { StackHeaderProps } from "@react-navigation/stack";
import React, { useCallback } from "react";
import { useEdgeSpacing, useTheme } from "../application/providers/Theming";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { Picture } from "./Picture";
import { opacify, rgba } from "polished";
import { ImageBackground } from "react-native";

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
  const Wrapper = useCallback<React.FunctionComponent>(
    ({ children }) => {
      if (hideBackground) {
        return (
          <Frame
            style={{
              display: "flex",
              backgroundColor: theme.colors.background,
              ...theme.constants.shadow,
            }}
          >
            {children}
          </Frame>
        );
      }

      return (
        <ImageBackground
          source={require("../assets/bg-pattern-grayscale.png")}
          style={{
            display: "flex",
            backgroundColor: theme.colors.background,
            ...theme.constants.shadow,
          }}
        >
          {children}
        </ImageBackground>
      );
    },
    [hideBackground, theme.colors.background, theme.constants.shadow]
  );
  return (
    <Wrapper>
      <Frame
        style={{
          height: insets.top,
          width: "100%",
          backgroundColor: rgba(255, 255, 255, 0),
        }}
      />
      <Frame
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          paddingLeft: theme.units[spacing.horizontal],
          paddingRight: theme.units[spacing.horizontal],
          paddingBottom: theme.units.large,
          paddingTop: theme.units.medium,
        }}
      >
        {!children && <Font variant="display">{scene.route.name}</Font>}
        {children}
      </Frame>
    </Wrapper>
  );
};

export { Header };

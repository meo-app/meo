import { StackHeaderProps } from "@react-navigation/stack";
import React from "react";
import { useEdgeSpacing, useTheme } from "../application/providers/Theming";
import { Font } from "./Font";
import { Frame } from "./Frame";

interface Props extends StackHeaderProps {}

const Header: React.FunctionComponent<Props> = function Header({
  insets,
  scene,
  children,
}) {
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  return (
    <>
      <Frame
        style={{
          height: insets.top,
          width: "100%",
          backgroundColor: theme.colors.background,
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
          backgroundColor: theme.colors.background,
          ...theme.constants.shadow,
        }}
      >
        {!children && <Font variant="display">{scene.route.name}</Font>}
        {children}
      </Frame>
    </>
  );
};

export { Header };

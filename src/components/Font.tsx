import React from "react";
import { Text, TextStyle } from "react-native";
import { Typography } from "../foundations/Typography";
import { useTheme } from "../providers/Theming";
import { Colors } from "../foundations/Colors";
import { SpacingProps, useFrame } from "./Frame";

interface Props extends React.ComponentProps<typeof Text> {
  variant?: keyof Typography;
  color?: keyof Colors;
  textAlign?: TextStyle["textAlign"];
}

interface Props extends SpacingProps {}

const Font: React.FunctionComponent<Props> = function Font(props) {
  const {
    variant = "body",
    color,
    textAlign,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    paddingHorizontal,
    paddingVertical,
    marginHorizontal,
    marginVertical,
    ...rest
  } = props;
  const theme = useTheme();
  const spacing = useFrame({
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    paddingHorizontal,
    paddingVertical,
    marginHorizontal,
    marginVertical,
  });
  return (
    <Text
      {...rest}
      style={[
        rest.style,
        spacing,
        theme.typography[variant],
        color && {
          color: theme.colors[color],
        },
        textAlign && {
          textAlign,
        },
      ]}
    />
  );
};

export { Font };

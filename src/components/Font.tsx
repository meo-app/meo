import React from "react";
import { Text, TextStyle } from "react-native";
import { Typography } from "../foundations/Typography";
import { useTheme } from "../application/providers/Theming";
import { Colors } from "../foundations/Colors";
import { SpacingProps, useFrame } from "./Frame";

interface Props extends React.ComponentProps<typeof Text> {
  variant?: keyof Typography;
  color?: keyof Colors;
  textAlign?: TextStyle["textAlign"];
}

interface Props extends SpacingProps {}

interface DefaultProps extends Required<Pick<Props, "variant">> {}

const defaultProps: DefaultProps = {
  variant: "body",
};

const Font: React.FunctionComponent<Props> = function Font(props) {
  const {
    variant,
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
    ...rest
  } = { ...defaultProps, ...props };
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

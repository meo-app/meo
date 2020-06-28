import React from "react";
import { Text } from "react-native";
import { Typography } from "../foundations/Typography";
import { useTheme } from "../application/providers/Theming";

interface Props extends React.ComponentProps<typeof Text> {
  variant?: keyof Typography;
}

interface DefaultProps extends Required<Pick<Props, "variant">> {}

const defaultProps: DefaultProps = {
  variant: "body",
};

const Font: React.FunctionComponent<Props> = function Font(props) {
  const { variant, ...rest } = { ...defaultProps, ...props };
  const theme = useTheme();
  return <Text {...rest} style={[rest.style, theme.typography[variant]]} />;
};

export { Font };

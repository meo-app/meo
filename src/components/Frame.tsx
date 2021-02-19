import React, { useCallback } from "react";
import { View, FlexStyle, StyleProp, ViewStyle } from "react-native";
import { Units, Scales } from "../foundations/Spacing";
import { useTheme } from "../application/providers/Theming";
import { useDebugTrace } from "../hooks/use-debug-trace";

type Value = keyof Units | "none";
type Spacing =
  | Value
  | [Value]
  | [Value, Value]
  | [Value, Value, Value]
  | [Value, Value, Value, Value];

interface SpacingStyles {
  marginTop?: Spacing;
  marginRight?: Spacing;
  marginBottom?: Spacing;
  marginLeft?: Spacing;
  paddingTop?: Spacing;
  paddingRight?: Spacing;
  paddingBottom?: Spacing;
  paddingLeft?: Spacing;
}

type Props = Pick<
  FlexStyle,
  | "justifyContent"
  | "alignItems"
  | "flex"
  | "flexBasis"
  | "flexGrow"
  | "flexWrap"
  | "flexDirection"
> & {
  style?: StyleProp<ViewStyle>;
  debugTrace?: boolean;
  backgroundColor?: string;
  width?: keyof Scales;
  height?: keyof Scales;
} & SpacingStyles;

const Frame: React.FunctionComponent<
  Props & React.ComponentProps<typeof View>
> = React.memo(function Frame({ children, ...props }) {
  const viewStyle = useFrameStyles(props);
  const {
    justifyContent,
    alignItems,
    flex,
    flexBasis,
    flexDirection,
    flexGrow,
    flexWrap,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    style,
    debugTrace,
    width,
    height,
    ...rest
  } = props;

  return (
    <View
      style={[viewStyle, ...(Array.isArray(props.style) ? props.style : [])]}
      {...rest}
    >
      {children}
    </View>
  );
});

function useFrameStyles({
  justifyContent,
  alignItems,
  flex,
  flexBasis,
  flexDirection,
  flexGrow,
  flexWrap,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  style,
  debugTrace,
  width,
  height,
}: Omit<Props, "children">): ViewStyle {
  const debugTraceStyles = useDebugTrace();
  const { units, scales } = useTheme();
  const getSpacing = useCallback(
    (key?: Spacing) =>
      key === "none" || !key ? 0 : units[key as keyof typeof units],
    [units]
  );
  return {
    justifyContent,
    alignItems,
    flex,
    flexBasis,
    flexGrow,
    flexWrap,
    flexDirection,
    marginRight: getSpacing(marginRight),
    marginTop: getSpacing(marginTop),
    marginBottom: getSpacing(marginBottom),
    marginLeft: getSpacing(marginLeft),
    paddingTop: getSpacing(paddingTop),
    paddingRight: getSpacing(paddingRight),
    paddingBottom: getSpacing(paddingBottom),
    paddingLeft: getSpacing(paddingLeft),
    ...(style as Object),
    ...(debugTrace && debugTraceStyles),
    ...(width && {
      width: scales[width],
    }),
    ...(height && {
      height: scales[height],
    }),
  };
}

export { Frame, useFrameStyles, Spacing, Props as FrameProps, SpacingStyles };

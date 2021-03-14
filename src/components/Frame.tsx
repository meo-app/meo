import React, { useCallback, useMemo } from "react";
import { View, FlexStyle, StyleProp, ViewStyle } from "react-native";
import { Units, Scales } from "../foundations/Spacing";
import { useTheme } from "../application/providers/Theming";
import { useDebugTrace } from "../hooks/use-debug-trace";
import { Colors } from "../foundations/Colors";

type Value = keyof Units | "none";
type Spacing =
  | Value
  | [Value]
  | [Value, Value]
  | [Value, Value, Value]
  | [Value, Value, Value, Value]
  | number;

interface SpacingProps {
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
  backgroundColor?: keyof Colors;
  width?: keyof Scales | number;
  height?: keyof Scales | number;
} & SpacingProps;

const Frame: React.FunctionComponent<
  Props & React.ComponentProps<typeof View>
> = React.memo(function Frame({ children, ...props }) {
  const frame = useFrame(props);
  const {
    /* eslint-disable @typescript-eslint/no-unused-vars */
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
    backgroundColor,
    ...rest
  } = props;

  return (
    <View
      style={[frame, ...(Array.isArray(props.style) ? props.style : [])]}
      {...rest}
    >
      {children}
    </View>
  );
});

function useFrame({
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
  backgroundColor,
}: Omit<Props, "children">): ViewStyle {
  const debugTraceStyles = useDebugTrace();
  const { units, scales, colors } = useTheme();
  const getSpacing = useCallback(
    (key?: Spacing) =>
      key === "none" || !key ? 0 : units[key as keyof typeof units],
    [units]
  );
  const spacing = useMemo(
    () => ({
      marginRight: getSpacing(marginRight),
      marginTop: getSpacing(marginTop),
      marginBottom: getSpacing(marginBottom),
      marginLeft: getSpacing(marginLeft),
      paddingTop: getSpacing(paddingTop),
      paddingRight: getSpacing(paddingRight),
      paddingBottom: getSpacing(paddingBottom),
      paddingLeft: getSpacing(paddingLeft),
    }),
    [
      getSpacing,
      marginBottom,
      marginLeft,
      marginRight,
      marginTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
    ]
  );
  return {
    justifyContent,
    alignItems,
    flex,
    flexBasis,
    flexGrow,
    flexWrap,
    flexDirection,
    ...spacing,
    ...(width && {
      width: typeof width === "string" ? scales[width] : width,
    }),
    ...(height && {
      height: typeof height === "string" ? scales[height] : height,
    }),
    ...(backgroundColor && {
      backgroundColor: colors[backgroundColor],
    }),
    ...(style as Object),
    ...(debugTrace && debugTraceStyles),
  };
}

export { Frame, useFrame, Spacing, Props as FrameProps, SpacingProps };

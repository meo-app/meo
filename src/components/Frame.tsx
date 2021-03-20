import { ThemeProvider } from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";
import { FlexStyle, StyleProp, View, ViewStyle } from "react-native";
import { Colors } from "../foundations/Colors";
import { Scales, Units } from "../foundations/Spacing";
import { useTheme } from "../providers/Theming";

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
  paddingHorizontal?: Value | number;
  paddingVertical?: Value | number;
  marginHorizontal?: Value | number;
  marginVertical?: Value | number;
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
  | "alignSelf"
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
    alignSelf,
    paddingHorizontal,
    paddingVertical,
    marginHorizontal,
    marginVertical,
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

const DEBUG_TRACE_STYLES: ViewStyle = {
  borderStyle: "dashed",
  borderWidth: 1,
  borderColor: "red",
};

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
  paddingHorizontal,
  paddingVertical,
  marginHorizontal,
  marginVertical,
  style,
  debugTrace,
  width,
  height,
  backgroundColor,
  alignSelf,
}: Omit<Props, "children">): ViewStyle {
  const { units, scales, colors } = useTheme();
  const getSpacing = useCallback(
    (key?: Spacing) =>
      key === "none" || !key ? undefined : units[key as keyof typeof units],
    [units]
  );
  const getEdgesSpacing = useCallback(
    (value: Value | number) => {
      if (typeof value === "number") {
        return value;
      }

      return units[value as keyof typeof units];
    },
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
      ...(paddingHorizontal && {
        paddingHorizontal: getEdgesSpacing(paddingHorizontal),
      }),
      ...(paddingVertical && {
        paddingVertical: getEdgesSpacing(paddingVertical),
      }),
      ...(marginHorizontal && {
        marginHorizontal: getEdgesSpacing(marginHorizontal),
      }),
      ...(marginVertical && {
        marginVertical: getEdgesSpacing(marginVertical),
      }),
    }),
    [
      getSpacing,
      marginRight,
      marginTop,
      marginBottom,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      getEdgesSpacing,
      paddingHorizontal,
      paddingVertical,
      marginHorizontal,
      marginVertical,
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
    alignSelf,
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
    ...(debugTrace && DEBUG_TRACE_STYLES),
  };
}

export { Frame, useFrame, Spacing, Props as FrameProps, SpacingProps };

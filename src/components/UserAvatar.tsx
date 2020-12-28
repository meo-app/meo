import React, { useEffect } from "react";
import FastImage from "react-native-fast-image";
import { useTheme } from "../application/providers/Theming";
import { Scales } from "../foundations/Spacing";
import { Picture } from "./Picture";

// TODO: This component will either render the user selected avatar (svg)
// or custom image uploaded by the user

interface Props {
  size?: "default" | "large";
}

const SIZE_MAP: {
  [k in NonNullable<Props["size"]>]: Extract<
    keyof Scales,
    "larger" | "largest"
  >;
} = {
  default: "larger",
  large: "largest",
};

const defaultProps: Required<Pick<Props, "size">> = {
  size: "default",
};

function UserAvatar(props: Props) {
  const { size } = { ...defaultProps, ...props };
  const theme = useTheme();
  const width = theme.scales[SIZE_MAP[size]];
  const source = "https://i.pravatar.cc/150";
  // TODO: this preload should happen at a root app level where all queries or images will be preloaded at once
  useEffect(() => {
    FastImage.preload([
      {
        uri: source,
      },
    ]);
  }, []);
  return (
    <Picture
      style={{
        borderRadius: theme.constants.absoluteRadius,
      }}
      lazyload={false}
      width={width}
      aspectRatio="square"
      resizeMode="cover"
      source={source}
    />
  );
}

export { UserAvatar };

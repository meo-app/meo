import React, { useEffect, useMemo } from "react";
import { useAvatar } from "../api/avatar";
import { useTheme } from "../application/providers/Theming";
import { Scales } from "../foundations/Spacing";
import { useStyles } from "../hooks/use-styles";
import { base64ToImageUrl } from "../utils/base64-to-image-url";
import { AvatarIds, AVATARS_LIST } from "./Avatars/avatars-list";
import { Image } from "react-native";
import { Frame } from "./Frame";
import { Picture } from "./Picture";
import FastImage from "react-native-fast-image";

// TODO: This component will either render the user selected avatar (svg)
// or custom image uploaded by the user

// const source = "https://i.pravatar.cc/150";
// TODO: this preload should happen at a root app level where all queries or images will be preloaded at once
// useEffect(() => {
//   FastImage.preload([
//     {
//       uri: source,
//     },
//   ]);
// }, []);

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

const UserAvatar = React.memo(function UserAvatar(props: Props) {
  const { data } = useAvatar();
  const { size } = { ...defaultProps, ...props };
  const theme = useTheme();
  const width = theme.scales[SIZE_MAP[size]];
  const styles = useStyles(
    (theme) => ({
      root: {
        width,
        height: width,
        borderRadius: theme.constants.absoluteRadius,
      },
    }),
    [width, theme.constants.absoluteRadius]
  );

  const node = useMemo(
    () => AVATARS_LIST.find((item) => item.id === data?.avatarId)?.node,
    [data?.avatarId]
  );

  if (!data) {
    return null;
  }

  if (data.avatarId === AvatarIds.__USER_PHOTO__ && data.base64) {
    return (
      <Frame style={styles.root}>
        <FastImage
          style={styles.root}
          // lazyload={false}
          // aspectRatio="square"
          resizeMode="cover"
          source={{
            uri: base64ToImageUrl(data.base64),
          }}
        />
      </Frame>
    );
  } else {
    return <Frame style={styles.root}>{node}</Frame>;
  }
});

export { UserAvatar };

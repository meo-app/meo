import React, { useMemo } from "react";
import { Image, Platform, View } from "react-native";
import FastImage from "react-native-fast-image";
import { useTheme } from "../application/providers/Theming";
import { Scales } from "../foundations/Spacing";
import { useStyles } from "../hooks/use-styles";
import { useAvatar } from "../storage/avatar";
import { base64ToImageUrl } from "../shared/image-utils";
import { AVATARS_LIST } from "./Avatars/avatars-list";

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
  const styles = useStyles((theme) => ({
    root: {
      width,
      height: width,
      borderRadius: theme.constants.absoluteRadius,
      overflow: "hidden",
    },
  }));

  const uri = useMemo(() => {
    const source = AVATARS_LIST.find(({ id }) => id === data?.avatarId)?.source;
    if (source) {
      return source;
    }

    if (data?.base64) {
      return base64ToImageUrl(data?.base64 || "");
    }
  }, [data?.avatarId, data?.base64]);

  if (!data || !uri) {
    return null;
  }

  return (
    <View style={styles.root}>
      {Platform.OS === "ios" && (
        <FastImage
          style={styles.root}
          resizeMode="cover"
          source={{
            uri,
          }}
        />
      )}
      {Platform.OS === "android" && (
        <Image
          style={styles.root}
          resizeMode="cover"
          source={{
            uri,
          }}
        />
      )}
    </View>
  );
});

export { UserAvatar };

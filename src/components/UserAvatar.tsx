import React, { useMemo } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Scales } from "../foundations/Spacing";
import { useTheme } from "../providers/Theming/hooks/use-theme";
import { AVATARS_LIST } from "../shared/avatars-list";
import { base64ToImageUrl } from "../shared/image-utils";
import { useAvatar } from "../storage/avatar";

interface Props {
  size?: keyof Scales | number;
}

const UserAvatar = React.memo<Props>(function UserAvatar({
  children,
  size = "large",
}) {
  const { data } = useAvatar();
  const theme = useTheme();
  const width = typeof size === "string" ? theme.scales[size] : size;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          width,
          height: width,
          borderRadius: theme.constants.absoluteRadius,
          overflow: "hidden",
        },
      }),
    [theme.constants.absoluteRadius, width]
  );

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
      <Image
        style={styles.root}
        resizeMode="cover"
        source={{
          uri,
        }}
      >
        {children}
      </Image>
    </View>
  );
});

export { UserAvatar };

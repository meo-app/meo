import React, { useMemo } from "react";
import { Image, View } from "react-native";
import { Scales } from "../foundations/Spacing";
import { useStyles } from "../hooks/use-styles";
import { useTheme } from "../providers/Theming";
import { base64ToImageUrl } from "../shared/image-utils";
import { useAvatar } from "../storage/avatar";
import { AVATARS_LIST } from "../shared/avatars-list";

interface Props {
  size?: keyof Scales;
}

const UserAvatar = React.memo<Props>(function UserAvatar({
  children,
  size = "large",
}) {
  const { data } = useAvatar();
  const theme = useTheme();
  const width = theme.scales[size];
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

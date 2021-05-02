import { transparentize } from "polished";
import React, { useState, useMemo } from "react";
import { ImageBackground, Pressable, StyleSheet } from "react-native";
import { useQuery } from "react-query";
import { useTheme } from "../../../providers/Theming/hooks/use-theme";
import { AvatarIds } from "../../../shared/avatars-list";
import { base64ToImageUrl } from "../../../shared/image-utils";
import { QueryKeys } from "../../../shared/QueryKeys";
import { Frame } from "../../Frame";
import { Icon } from "../../Icon/Icon";
import { useAvatarSelectionContext } from "../hooks/use-avatar-selection-context";
import { useAvatarSelectionSize } from "../hooks/use-avatar-selection-size";
import { pickImageQuery } from "../queries/pick-image-query";

function AvatarUploadButton() {
  const theme = useTheme();
  const { photo, setAvatarId, setSelectedPhoto } = useAvatarSelectionContext();
  const [isImagePickerOpened, setImagePickerOpen] = useState(false);
  const size = useAvatarSelectionSize();

  // TODO: simplify it without a query
  useQuery<{
    base64?: string;
  } | null>(
    QueryKeys.PICK_AVATAR_PHOTO,
    () => (!isImagePickerOpened ? Promise.resolve(null) : pickImageQuery()),
    {
      enabled: isImagePickerOpened,
      onSuccess: (data) => {
        setImagePickerOpen(false);
        if (data && data.base64) {
          setSelectedPhoto(data.base64);
        }
      },
    }
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderRadius: theme.constants.absoluteRadius,
          backgroundColor: theme.colors.absoluteDark,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          position: "relative",
        },
        overlay: {
          backgroundColor: transparentize(0.4, theme.colors.absoluteDark),
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          zIndex: 1,
        },
        icon: {
          position: "absolute",
          zIndex: 2,
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
        },
      }),
    [theme.colors.absoluteDark, theme.constants.absoluteRadius]
  );

  return (
    <Pressable
      style={[styles.root, { width: size, height: size }]}
      onPress={() => {
        setAvatarId(AvatarIds.__USER_PHOTO__);
        setImagePickerOpen(true);
      }}
    >
      {!photo && <Icon type="Camera" color="absoluteLight" size="medium" />}
      {photo && (
        <ImageBackground
          source={{
            uri: base64ToImageUrl(photo),
            cache: "force-cache",
          }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: theme.constants.absoluteRadius,
          }}
        >
          <Frame style={styles.overlay} />
          <Frame style={styles.icon}>
            <Icon type="Edit" size="medium" color="absoluteLight" />
          </Frame>
        </ImageBackground>
      )}
    </Pressable>
  );
}

export { AvatarUploadButton };

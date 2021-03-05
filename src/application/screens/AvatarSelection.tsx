import * as ImagePicker from "expo-image-picker";
import { transparentize } from "polished";
import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  ListRenderItem,
  Pressable,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useQuery } from "react-query";
import {
  AvatarIds,
  AVATARS_LIST,
  DefaultAvatar,
} from "../../components/Avatars/avatars-list";
import { Frame } from "../../components/Frame";
import { Icon } from "../../components/Icon/Icon";
import { SubtitleHeader } from "../../components/SubtitleHeader";
import { useStyles } from "../../hooks/use-styles";
import { QueryKeys } from "../../shared/QueryKeys";
import { useAvatar, useSelectAvatar } from "../../storage/avatar";
import { assert } from "../../utils/assert";
import { base64ToImageUrl } from "../../utils/base64-to-image-url";
import { useTheme } from "../providers/Theming";

async function getImage(): Promise<{ base64?: string } | null> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });
    if (result.cancelled) {
      return null;
    }
    return {
      base64: result.base64,
    };
  } catch (e) {
    throw new Error(e);
  }
}

const Context = React.createContext<{
  avatarId: AvatarIds;
  setAvatarId: (id: AvatarIds) => void;
  setSelectedPhoto: (photo: string) => void;
  photo: string | null;
  disabled: boolean;
  onSave: () => void;
} | null>(null);

function useAvatarContext() {
  const context = useContext(Context);
  assert(context, "Avatar Context not found");
  return context;
}

const AvatarContextProvider: React.FunctionComponent<{
  onSuccess?: () => void;
}> = function AvatarContextProvider({ children, onSuccess }) {
  const { data } = useAvatar();
  const [photo, setSelectedPhoto] = useState<string | null>(
    data?.avatarId === AvatarIds.__USER_PHOTO__ ? String(data.base64) : null
  );
  const [avatarId, setAvatarId] = useState<AvatarIds>(AvatarIds.Wynonna);
  const { mutate } = useSelectAvatar({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const onSave = useCallback(() => {
    if (avatarId === AvatarIds.__USER_PHOTO__ && photo) {
      return mutate({
        avatarId,
        base64: photo,
      });
    }
    return mutate({
      avatarId,
    });
  }, [avatarId, mutate, photo]);

  let disabled = true;
  if (avatarId !== AvatarIds.__USER_PHOTO__) {
    disabled = false;
  } else if (avatarId === AvatarIds.__USER_PHOTO__) {
    disabled = photo === null;
  }

  return (
    <Context.Provider
      value={{
        photo,
        setSelectedPhoto,
        disabled,
        onSave,
        avatarId,
        setAvatarId,
      }}
    >
      {children}
    </Context.Provider>
  );
};

function UploadButton() {
  const theme = useTheme();
  const { photo, setAvatarId, setSelectedPhoto } = useAvatarContext();
  const [isImagePickerOpened, setImagePickerOpen] = useState(false);

  useQuery<{
    base64?: string;
  } | null>(
    QueryKeys.PICK_AVATAR_PHOTO,
    () => (!isImagePickerOpened ? Promise.resolve(null) : getImage()),
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

  const styles = useStyles((theme) => ({
    root: {
      height: size,
      width: size,
      borderRadius: 46,
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
  }));

  return (
    <Pressable
      style={styles.root}
      onPress={() => {
        setAvatarId(AvatarIds.__USER_PHOTO__);
        setImagePickerOpen(true);
      }}
    >
      {!photo && <Icon type="Camera" color="absoluteLight" size="larger" />}
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

interface Props {
  mode?: "onboarding" | "default";
}

interface DefaultProps extends Required<Pick<Props, "mode">> {}

const defaultProps: DefaultProps = {
  mode: "default",
};

const size = 120;

function AvatarSelection(props: Props) {
  const { mode } = { ...defaultProps, ...props };
  const theme = useTheme();
  const { setAvatarId, avatarId } = useAvatarContext();
  const styles = useStyles(() => ({
    avatar: {
      flex: 1,
      borderRadius: theme.constants.absoluteRadius,
    },
  }));

  const renderItem = useCallback<ListRenderItem<DefaultAvatar>>(
    ({ item: { id, source } }) => {
      return (
        <Frame
          key={`avatar-${id}`}
          marginBottom="large"
          marginTop="large"
          style={{
            height: size,
            width: size,
            flex: 1 / 2,
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => setAvatarId(id)} style={[styles.avatar]}>
            {avatarId === id && (
              <View
                style={{
                  position: "absolute",
                  backgroundColor: theme.colors.primary,
                  width: size,
                  height: size,
                  borderRadius: 46,
                  transform: [
                    {
                      scale: 1.1,
                    },
                  ],
                }}
              />
            )}
            {source ? (
              <Image
                source={{ uri: source }}
                resizeMode="cover"
                style={{
                  width: size,
                  height: size,
                  borderRadius: 46,
                  overflow: "hidden",
                }}
              />
            ) : (
              <UploadButton />
            )}
          </Pressable>
        </Frame>
      );
    },
    [avatarId, setAvatarId, styles.avatar, theme.colors.primary]
  );

  const data = useMemo(
    () => [
      ...AVATARS_LIST,
      {
        id: AvatarIds.__USER_PHOTO__,
      },
    ],
    []
  );

  return (
    <Frame flex={1} justifyContent="flex-start" alignItems="center">
      {mode === "default" && <SubtitleHeader title="Select your avatar" />}
      <Frame
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        flex={1}
      >
        <FlatList
          scrollEnabled={false}
          data={data}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{
            flexGrow: 1 / 2,
            ...(mode === "onboarding" && {
              flexGrow: 1,
            }),
            paddingHorizontal: theme.units.large,
            justifyContent: "center",
          }}
        />
      </Frame>
    </Frame>
  );
}

export { AvatarSelection, AvatarContextProvider, useAvatarContext };

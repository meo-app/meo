import * as ImagePicker from "expo-image-picker";
import { transparentize } from "polished";
import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useQuery, useQueryClient } from "react-query";
import { useTheme } from "../providers/Theming";
import { assert } from "../shared/assert";
import { AvatarIds, AVATARS_LIST, DefaultAvatar } from "../shared/avatars-list";
import { base64ToImageUrl } from "../shared/image-utils";
import { QueryKeys } from "../shared/QueryKeys";
import { useAvatar, useSelectAvatar } from "../storage/avatar";
import { Frame } from "./Frame";
import { Icon } from "./Icon/Icon";

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
  saveAvatar: () => void;
} | null>(null);

function useAvatarContext() {
  const context = useContext(Context);
  assert(context, "Avatar Context not found");
  return context;
}

const AvatarSelectionProvider: React.FunctionComponent<{
  onSuccess?: () => void;
}> = function AvatarSelectionProvider({ children, onSuccess }) {
  const { data } = useAvatar();
  const [photo, setSelectedPhoto] = useState<string | null>(
    data?.avatarId === AvatarIds.__USER_PHOTO__ ? String(data.base64) : null
  );
  const [avatarId, setAvatarId] = useState<AvatarIds>(AvatarIds.Wynonna);
  const client = useQueryClient();
  const { mutate } = useSelectAvatar({
    onSuccess: () => {
      client.invalidateQueries(QueryKeys.GET_USER_AVATAR);
      onSuccess?.();
    },
  });

  const saveAvatar = useCallback(() => {
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
        saveAvatar,
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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          height: size,
          width: size,
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
      style={styles.root}
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

const size = 120;
const data = [...AVATARS_LIST, { id: AvatarIds.__USER_PHOTO__ }];

function AvatarSelection() {
  const theme = useTheme();
  const { setAvatarId, avatarId } = useAvatarContext();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        avatar: {
          flex: 1,
          borderRadius: theme.constants.absoluteRadius,
        },
      }),
    [theme.constants.absoluteRadius]
  );

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
                  borderRadius: theme.constants.absoluteRadius,
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
                resizeMode="contain"
                style={{
                  width: size,
                  height: size,
                  borderRadius: theme.constants.absoluteRadius,
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
    [
      avatarId,
      setAvatarId,
      styles.avatar,
      theme.colors.primary,
      theme.constants.absoluteRadius,
    ]
  );

  return (
    <Frame flex={1} justifyContent="flex-start" alignItems="center">
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
            paddingHorizontal: theme.units.large,
            justifyContent: "center",
          }}
        />
      </Frame>
    </Frame>
  );
}

export { AvatarSelection, AvatarSelectionProvider, useAvatarContext };

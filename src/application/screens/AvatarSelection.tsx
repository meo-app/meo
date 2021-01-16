// TODO: remove react-native fs
import * as ImagePicker from "expo-image-picker";
import { transparentize } from "polished";
import React, { useCallback, useContext, useState } from "react";
import { ImageBackground, Pressable, Text } from "react-native";
import { useQuery, UseQueryOptions } from "react-query";
import { useAvatar, useSelectAvatar } from "../../api/avatar";
import { QueryIds } from "../../api/QueryIds";
import { AvatarIds, AVATARS_LIST } from "../../components/Avatars/avatars-list";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Grid, useGridUnitWidth } from "../../components/Grid";
import { Icon } from "../../components/Icon/Icon";
import { SubtitleHeader } from "../../components/SubtitleHeader";
import { useStyles } from "../../hooks/use-styles";
import { assert } from "../../utils/assert";
import { base64ToImageUrl } from "../../utils/base64-to-image-url";
import { useEdgeSpacing, useTheme } from "../providers/Theming";

// TODO: remove  grid and user flatlist

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

function useImageSelector(
  options?: UseQueryOptions<{ base64?: string } | null>
) {
  return useQuery<{
    base64?: string;
  } | null>(
    QueryIds.pickAvatarPhoto,
    () => (!options?.enabled ? Promise.resolve(null) : getImage()),
    options
  );
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
  useImageSelector({
    enabled: isImagePickerOpened,
    onSuccess: (data) => {
      setImagePickerOpen(false);
      if (data && data.base64) {
        setSelectedPhoto(data.base64);
      }
    },
  });

  const styles = useStyles((theme) => ({
    root: {
      width: "100%",
      height: "100%",
      borderRadius: theme.constants.absoluteRadius,
      backgroundColor: theme.colors.backgroundAccent,
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
    save: {},
  }));

  return (
    <Pressable
      style={styles.root}
      onPress={async () => {
        setAvatarId(AvatarIds.__USER_PHOTO__);
        setImagePickerOpen(true);
      }}
    >
      {!photo && (
        <Text
          style={{
            fontSize: 45,
          }}
        >
          📸
        </Text>
      )}
      {photo && (
        <>
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
        </>
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

function AvatarSelection(props: Props) {
  const { mode } = { ...defaultProps, ...props };
  const theme = useTheme();
  const { setAvatarId, avatarId, onSave, disabled } = useAvatarContext();
  const spacing = useEdgeSpacing();
  const gridConfig: Parameters<typeof useGridUnitWidth>[0] = {
    gap: "medium",
    margin: theme.units[spacing.vertical],
    numColumns: 2,
  };
  const width = useGridUnitWidth(gridConfig);
  const styles = useStyles(() => ({
    avatar: {
      flex: 1,
      borderRadius: theme.constants.absoluteRadius,
    },
    selected: {
      borderWidth: theme.units.small,
      borderColor: theme.colors.primary,
    },
  }));
  return (
    <Frame
      flex={1}
      justifyContent="flex-start"
      backgroundColor={
        mode === "default" ? theme.colors.background : "transparent"
      }
      alignItems="center"
    >
      {mode === "default" && <SubtitleHeader title="Select your avatar" />}
      <Frame
        paddingTop="large"
        flex={1 / 0.5}
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Grid
          numColumns={2}
          margin={theme.units[spacing.vertical]}
          gap="medium"
        >
          {AVATARS_LIST.map(({ node, id }) => (
            <Frame
              key={`avatar-${id}`}
              style={{
                width: width,
                height: width,
              }}
            >
              <Pressable
                onPress={() => setAvatarId(id)}
                style={[styles.avatar, avatarId === id && styles.selected]}
              >
                {node}
              </Pressable>
            </Frame>
          ))}
          <Frame
            key={`avatar-${AvatarIds.__USER_PHOTO__}`}
            style={{
              width: width,
              height: width,
            }}
          >
            <Pressable
              onPress={() => setAvatarId(AvatarIds.__USER_PHOTO__)}
              style={[
                styles.avatar,
                avatarId === AvatarIds.__USER_PHOTO__ && styles.selected,
              ]}
            >
              <UploadButton />
            </Pressable>
          </Frame>
        </Grid>
      </Frame>
      {mode === "default" && (
        <Frame flex={0.5}>
          {/* TODO: redesign buttons/actions etc */}
          <Pressable
            disabled={disabled}
            onPress={() => onSave()}
            style={({ pressed }) => ({
              backgroundColor: disabled
                ? theme.colors.foregroundSecondary
                : theme.colors.primary,
              opacity: pressed ? 0.5 : 1,
              paddingTop: theme.units.small,
              paddingBottom: theme.units.small,
              paddingLeft: theme.units.large,
              paddingRight: theme.units.large,
              borderRadius: theme.constants.absoluteRadius,
              alignItems: "center",
            })}
          >
            <Font color="absoluteLight">Save</Font>
          </Pressable>
        </Frame>
      )}
    </Frame>
  );
}

export { AvatarSelection, AvatarContextProvider, useAvatarContext };

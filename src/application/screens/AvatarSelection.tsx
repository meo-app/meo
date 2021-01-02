import CameraRoll from "@react-native-community/cameraroll";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { transparentize } from "polished";
import React, { useCallback, useContext, useRef, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  Text,
} from "react-native";
import { useSelectAvatar } from "../../api/avatar";
import { usePhotoGallery } from "../../api/photo-gallery";
import { Avatar01 } from "../../components/Avatars/Avatar01";
import { Avatar02 } from "../../components/Avatars/Avatar02";
import { Avatar03 } from "../../components/Avatars/Avatar03";
import { Avatar04 } from "../../components/Avatars/Avatar04";
import { AvatarIds, AVATARS_LIST } from "../../components/Avatars/avatars-list";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { FlatListGrid, Grid, useGridUnitWidth } from "../../components/Grid";
import { Icon } from "../../components/Icon/Icon";
import { SubtitleHeader } from "../../components/SubtitleHeader";
import { useStyles } from "../../hooks/use-styles";
import { RootStackRoutes } from "../../root-stack-routes";
import { assert } from "../../utils/assert";
import { useEdgeSpacing, useTheme } from "../providers/Theming";
import { ImageSelection } from "./ImageSelection";

enum AvatarStackRoutes {
  AvatarSelection = "AvatarSelection",
  ImageSelection = "ImageSelection",
}

type AvatarStackParamsList = {
  AvatarSelection: undefined;
  ImageSelection: undefined;
};

const Stack = createStackNavigator();
const Context = React.createContext<{
  avatarId: AvatarIds;
  setAvatarId: (id: AvatarIds) => void;
  setSelectedPhoto: (photo: CameraRoll.PhotoIdentifier) => void;
  photo: CameraRoll.PhotoIdentifier | null;
  onSave: () => void;
} | null>(null);

function useAvatarContext() {
  const context = useContext(Context);
  assert(context, "Avatar Context not found");
  return context;
}

const AvatarContextProvider: React.FunctionComponent = function AvatarContextProvider({
  children,
}) {
  // TODO: load selected index  ||  image
  const [photo, setSelectedPhoto] = useState<CameraRoll.PhotoIdentifier | null>(
    null
  );
  const [avatarId, setAvatarId] = useState<AvatarIds>(AvatarIds.Wynonna);
  const navigation = useNavigation();
  const { mutate } = useSelectAvatar({
    onSuccess: () => {
      navigation.navigate(RootStackRoutes.Home);
    },
  });

  const onSave = useCallback(() => {
    if (avatarId === AvatarIds.__USER_PHOTO__ && photo) {
      Alert.alert("TODO: store photo on device");
      return;
    }
    mutate({
      avatarId,
    });
  }, [avatarId, mutate, photo]);

  return (
    <Context.Provider
      value={{
        photo,
        setSelectedPhoto,
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
  const navigation = useNavigation<NavigationProp<AvatarStackParamsList>>();
  const { photo, setAvatarId } = useAvatarContext();
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
  }));
  return (
    <Pressable
      style={styles.root}
      onPress={() => {
        setAvatarId(AvatarIds.__USER_PHOTO__);
        navigation.navigate(AvatarStackRoutes.ImageSelection);
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
            source={{ uri: photo.node.image.uri, cache: "force-cache" }}
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

function AvatarSelection() {
  const theme = useTheme();
  const { setAvatarId, avatarId, onSave } = useAvatarContext();
  const spacing = useEdgeSpacing();
  const gridConfig: Parameters<typeof useGridUnitWidth>[0] = {
    gap: "medium",
    margin: theme.units[spacing.vertical],
    numColumns: 2,
  };
  const width = useGridUnitWidth(gridConfig);
  return (
    <Frame
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <SubtitleHeader title="Select your avatar" />
      <Frame
        style={{
          paddingTop: theme.units.large,
          flex: 1 / 0.5,
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
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
                style={{
                  flex: 1,
                  borderRadius: theme.constants.absoluteRadius,
                  ...(avatarId === id && {
                    borderWidth: theme.units.small,
                    borderColor: theme.colors.primary,
                  }),
                }}
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
              style={{
                flex: 1,
                borderRadius: theme.constants.absoluteRadius,
                ...(avatarId === AvatarIds.__USER_PHOTO__ && {
                  borderWidth: theme.units.small,
                  borderColor: theme.colors.primary,
                }),
              }}
            >
              <UploadButton />
            </Pressable>
          </Frame>
        </Grid>
      </Frame>
      <Frame flex={0.5}>
        <Pressable
          onPress={() => onSave()}
          style={({ pressed }) => ({
            backgroundColor: false
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
    </Frame>
  );
}

function Screens() {
  const { setSelectedPhoto } = useAvatarContext();
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={AvatarStackRoutes.AvatarSelection}
        component={AvatarSelection}
      />
      <Stack.Screen name={AvatarStackRoutes.ImageSelection}>
        {(props) => (
          <ImageSelection {...props} onSelectPhoto={setSelectedPhoto} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function Root() {
  return (
    <AvatarContextProvider>
      <Screens />
    </AvatarContextProvider>
  );
}

export { Root as AvatarSelection };

import CameraRoll from "@react-native-community/cameraroll";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { transparentize } from "polished";
import React, { useCallback, useContext, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  Text,
} from "react-native";
import { useQuery } from "react-query";
import { useSelectAvatar } from "../../api/avatar";
import { QueryIds } from "../../api/QueryIds";
import { Avatar01 } from "../../components/Avatars/Avatar01";
import { Avatar02 } from "../../components/Avatars/Avatar02";
import { Avatar03 } from "../../components/Avatars/Avatar03";
import { Avatar04 } from "../../components/Avatars/Avatar04";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { FlatListGrid, Grid, useGridUnitWidth } from "../../components/Grid";
import { Icon } from "../../components/Icon/Icon";
import { SubtitleHeader } from "../../components/SubtitleHeader";
import { useStyles } from "../../hooks/use-styles";
import { RootStackRoutes } from "../../root-stack-routes";
import { assert } from "../../utils/assert";
import { useEdgeSpacing, useTheme } from "../providers/Theming";

// TODO: better data structure for avatars with id's etc. support n avatars
export const AVATARS = [
  <Avatar01 />,
  <Avatar02 />,
  <Avatar03 />,
  <Avatar04 />,
  <Avatar01 />,
  <UploadButton />,
];

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
  selectedIndex: number;
  setSelectedIndex: (value: number) => void;
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
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const navigation = useNavigation();
  const { mutate } = useSelectAvatar({
    onSuccess: () => {
      navigation.navigate(RootStackRoutes.Home);
    },
  });
  const onSave = useCallback(() => {
    if (selectedIndex === 5 && photo) {
      // upload photo
      return;
    }
    mutate({
      index: selectedIndex,
    });
  }, [mutate, photo, selectedIndex]);
  return (
    <Context.Provider
      value={{
        onSave,
        photo,
        setSelectedPhoto,
        selectedIndex,
        setSelectedIndex,
      }}
    >
      {children}
    </Context.Provider>
  );
};

function UploadButton() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<AvatarStackParamsList>>();
  const { photo, setSelectedIndex } = useAvatarContext();
  const styles = useStyles((theme) => ({
    watermark: {
      backgroundColor: transparentize(0.4, theme.colors.absoluteDark),
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      zIndex: 1,
    },
  }));
  return (
    <Pressable
      onPress={() => {
        setSelectedIndex(5);
        navigation.navigate(AvatarStackRoutes.ImageSelection);
      }}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: theme.constants.absoluteRadius,
        backgroundColor: theme.colors.backgroundAccent,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
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
            <Frame style={styles.watermark} />
            <Frame
              style={{
                position: "absolute",
                zIndex: 2,
                left: 0,
                top: 0,
                bottom: 0,
                right: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon type="Edit" size="larger" color="absoluteLight" />
            </Frame>
          </ImageBackground>
        </>
      )}
    </Pressable>
  );
}

function usePhotoGallery() {
  const [page, setPage] = React.useState(0);
  const next = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const result = useQuery(
    [QueryIds.getUserPhotos, page],
    () =>
      CameraRoll.getPhotos({
        first: (page + 1) * 100,
        assetType: "Photos",
      }),
    { keepPreviousData: true, staleTime: 5000 }
  );

  return {
    ...result,
    next,
  };
}

function ImageSelection() {
  const {
    data,
    isLoading,
    isError,
    next,
    isFetching,
    refetch,
  } = usePhotoGallery();
  const navigation = useNavigation();
  const momentumRef = useRef(false);
  const theme = useTheme();
  const gridConfig: Parameters<typeof useGridUnitWidth>[0] = {
    gap: "smallest",
    numColumns: 3,
    margin: theme.units.smallest,
  };
  const width = useGridUnitWidth(gridConfig);
  const { setSelectedPhoto } = useAvatarContext();

  return (
    <Frame flex={1}>
      <SubtitleHeader
        backContent={
          <Pressable onPress={() => navigation.goBack()}>
            <Font variant="body" color="primary">
              Cancel
            </Font>
          </Pressable>
        }
      />
      {isLoading && <Font>TODO: loading state</Font>}
      {isError && <Font>TODO: error state</Font>}
      {Boolean(data?.edges && !data.edges.length) && (
        <Font>There are no images in your phone gallery</Font>
      )}
      {data?.edges.length && (
        <FlatListGrid<CameraRoll.PhotoIdentifier>
          {...gridConfig}
          data={data.edges}
          keyExtractor={(item) =>
            `${item.node.image.filename}-${item.node.image.uri}`
          }
          refreshing={isFetching}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={() => refetch()}
            />
          }
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            momentumRef.current = true;
          }}
          onEndReached={() => {
            if (momentumRef.current) {
              momentumRef.current = false;
              next();
            }
          }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedPhoto(item);
                navigation.goBack();
              }}
            >
              {/**
               * Picture uses FastImage underneath and it doesnt support images loaded from device url.
               * Instead we are using react-native's Image component here
               **/}
              <Image
                source={{ uri: item.node.image.uri, cache: "force-cache" }}
                resizeMode="cover"
                style={{
                  height: width,
                }}
              />
            </Pressable>
          )}
        />
      )}
    </Frame>
  );
}

function AvatarSelection() {
  const theme = useTheme();
  const { selectedIndex, setSelectedIndex, onSave } = useAvatarContext();
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
          {AVATARS.map((content, index) => {
            return (
              <Frame
                key={`avatar-${index}`}
                style={{
                  width: width,
                  height: width,
                }}
              >
                <Pressable
                  onPress={() => setSelectedIndex(index)}
                  style={{
                    flex: 1,
                    borderRadius: theme.constants.absoluteRadius,
                    ...(index === selectedIndex && {
                      borderWidth: theme.units.small,
                      borderColor: theme.colors.primary,
                    }),
                  }}
                >
                  {content}
                </Pressable>
              </Frame>
            );
          })}
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

function Root() {
  return (
    <AvatarContextProvider>
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
        <Stack.Screen
          name={AvatarStackRoutes.ImageSelection}
          component={ImageSelection}
        />
      </Stack.Navigator>
    </AvatarContextProvider>
  );
}

export { Root as AvatarSelection };

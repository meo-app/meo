import CameraRoll from "@react-native-community/cameraroll";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { opacify, transparentize } from "polished";
import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  Text,
} from "react-native";
import { useQuery } from "react-query";
import { QueryIds } from "../../api/QueryIds";
import { Avatar01 } from "../../components/Avatars/Avatar01";
import { Avatar02 } from "../../components/Avatars/Avatar02";
import { Avatar03 } from "../../components/Avatars/Avatar03";
import { Avatar04 } from "../../components/Avatars/Avatar04";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { FlatListGrid, useGridUnitWidth } from "../../components/Grid";
import { Header } from "../../components/Header";
import { useStyles } from "../../hooks/use-styles";
import { useTheme } from "../providers/Theming";

enum AvatarStackRoutes {
  AvatarSelection = "AvatarSelection",
  ImageSelection = "ImageSelection",
}

type AvatarStackParamsList = {
  AvatarSelection: undefined;
  ImageSelection: undefined;
};

const Stack = createStackNavigator();

function UploadButton() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<AvatarStackParamsList>>();
  return (
    <Pressable
      onPress={() => navigation.navigate(AvatarStackRoutes.ImageSelection)}
      style={{
        width: 100,
        height: 100,
        borderRadius: theme.constants.absoluteRadius,
        backgroundColor: theme.colors.backgroundAccent,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 45,
        }}
      >
        📸
      </Text>
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
  const momentumRef = useRef(false);
  const theme = useTheme();
  const styles = useStyles(() => ({
    watermark: {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      backgroundColor: transparentize(0.3, theme.colors.backgroundAccent),
    },
  }));
  const gridConfig: Parameters<typeof useGridUnitWidth>[0] = {
    gap: "smallest",
    numColumns: 3,
    margin: theme.units.smallest,
  };
  const width = useGridUnitWidth(gridConfig);
  const [selected, setSelected] = useState<CameraRoll.PhotoIdentifier | null>();
  return (
    <Frame flex={1}>
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
                setSelected(item);
              }}
            >
              {/**
               * Picture uses FastImage underneath and it doesnt support images loaded from device url.
               * Instead we are using react-native's Image component here
               **/}
              <ImageBackground
                source={{ uri: item.node.image.uri, cache: "force-cache" }}
                resizeMode="cover"
                style={{
                  height: width,
                }}
              >
                {selected?.node.image.uri === item.node.image.uri && (
                  <Frame style={styles.watermark} />
                )}
              </ImageBackground>
            </Pressable>
          )}
        />
      )}
    </Frame>
  );
}

function AvatarSelection() {
  const theme = useTheme();
  return (
    <Frame
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Frame
        style={{
          height: "80%",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {[
          <Avatar01 />,
          <Avatar02 />,
          <Avatar03 />,
          <Avatar04 />,
          <Avatar01 />,
          <UploadButton />,
        ].map((content, index) => {
          return (
            <Frame
              key={`avatar-${index}`}
              marginTop="largest"
              style={{
                width: "50%",
                height: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {content}
            </Frame>
          );
        })}
      </Frame>
    </Frame>
  );
}

function Root() {
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        headerShown: false,
        header: (props) => (
          <Header {...props} hideBackground>
            {/* TODO: HeaderSubtitle component */}
            <Frame
              justifyContent="center"
              style={{
                width: "100%",
              }}
            >
              <Font
                variant="subtitle"
                style={{
                  textAlign: "center",
                }}
              >
                Select a photo
              </Font>
            </Frame>
          </Header>
        ),
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={AvatarStackRoutes.AvatarSelection}
        component={AvatarSelection}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={AvatarStackRoutes.ImageSelection}
        component={ImageSelection}
      />
    </Stack.Navigator>
  );
}

export { Root as AvatarSelection };

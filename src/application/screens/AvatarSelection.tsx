import CameraRoll from "@react-native-community/cameraroll";
import {
  NavigationProp,
  ThemeProvider,
  useNavigation,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Image, Pressable, useWindowDimensions, View } from "react-native";
import { useQuery } from "react-query";
import { QueryIds } from "../../api/QueryIds";
import { Avatar01 } from "../../components/Avatars/Avatar01";
import { Avatar02 } from "../../components/Avatars/Avatar02";
import { Avatar03 } from "../../components/Avatars/Avatar03";
import { Avatar04 } from "../../components/Avatars/Avatar04";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Grid, useGridUnitWidth } from "../../components/Grid";
import { Header } from "../../components/Header";
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
  // TODO: type check all useNavigation hooks
  const navigation = useNavigation<NavigationProp<AvatarStackParamsList>>();
  return (
    <Pressable
      onPress={() => navigation.navigate(AvatarStackRoutes.ImageSelection)}
      style={{
        width: theme.scales.largest,
        height: theme.scales.largest,
        borderRadius: theme.constants.absoluteRadius,
      }}
    />
  );
}

function usePhotoGallery() {
  return useQuery(QueryIds.getUserPhotos, () =>
    CameraRoll.getPhotos({ first: 10, assetType: "Photos" })
  );
}

function ImageSelection() {
  const { data, isLoading, isError } = usePhotoGallery();
  const theme = useTheme();
  const gridConfig: Parameters<typeof useGridUnitWidth>[0] = {
    gap: "smallest",
    numColumns: 3,
    margin: theme.units.smallest,
  };
  const width = useGridUnitWidth(gridConfig);
  return (
    <Frame flex={1}>
      {isLoading && <Font>TODO: loading state</Font>}
      {isError && <Font>TODO: error state</Font>}
      {Boolean(data?.edges && !data.edges.length) && (
        <Font>There are no images in your phone gallery</Font>
      )}
      <Grid {...gridConfig} virtualized>
        {data?.edges.map(({ node }) => (
          <Frame
            key={node.image.uri}
            style={{
              width,
              height: width,
            }}
          >
            <Image
              source={{ uri: node.image.uri }}
              resizeMode="cover"
              style={{
                width,
                height: width,
              }}
            />
          </Frame>
        ))}
      </Grid>
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
        name={AvatarStackRoutes.AvatarSelection}
        component={AvatarSelection}
      />
      <Stack.Screen
        name={AvatarStackRoutes.ImageSelection}
        component={ImageSelection}
      />
    </Stack.Navigator>
  );
}

export { Root as AvatarSelection };

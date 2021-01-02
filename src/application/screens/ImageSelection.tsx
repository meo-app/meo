import CameraRoll from "@react-native-community/cameraroll";
import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import { Pressable, RefreshControl, Image } from "react-native";
import { usePhotoGallery } from "../../api/photo-gallery";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { useGridUnitWidth, FlatListGrid } from "../../components/Grid";
import { SubtitleHeader } from "../../components/SubtitleHeader";
import { useTheme } from "../providers/Theming";

interface Props {
  onSelectPhoto: (photo: CameraRoll.PhotoIdentifier) => void;
}

function ImageSelection({ onSelectPhoto }: Props) {
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
                onSelectPhoto(item);
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

export { ImageSelection };

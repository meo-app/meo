import React, { useCallback, useEffect } from "react";
import { FormattedDate } from "react-intl";
import { ListRenderItem } from "react-native";
import FastImage from "react-native-fast-image";
import { FlatList } from "react-native-gesture-handler";
import { Post } from "../api/Entities";
import { usePostsFlatList } from "../application/providers/HomeProvider";
import { useEdgeSpacing, useTheme } from "../application/providers/Theming";
import { timestampToDate } from "../utils/timestamp-to-date";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { Picture } from "./Picture";
import { PostTextContent } from "./PostTextContent";

function PostsList({ data }: { data?: Post[] }) {
  const theme = useTheme();
  const { postsRef } = usePostsFlatList();
  useEffect(() => {
    FastImage.preload([
      {
        uri: "https://i.pravatar.cc/150",
      },
    ]);
  }, []);
  const keyExtractor = useCallback(
    ({ id }: { id: string }) => `list-item-${id}`,
    []
  );

  const renderItem = useCallback<ListRenderItem<Post>>(
    ({ item, index }) => {
      // TODO: conditional wrap
      // TODO: fix this in search and home
      if (data && index === data.length - 1) {
        return (
          <Frame
            style={{
              paddingBottom: theme.units.largest * 3.5,
            }}
          >
            <PostLine {...item} />
          </Frame>
        );
      }

      return <PostLine {...item} />;
    },
    [data, theme.units.largest]
  );

  if (!Boolean(data?.length)) {
    return null;
  }
  return (
    <FlatList<Post>
      style={{
        height: "100%",
        backgroundColor: theme.colors.background,
      }}
      ref={postsRef}
      keyExtractor={keyExtractor}
      data={data}
      renderItem={renderItem}
    />
  );
}

const PostLine = React.memo(function PostLine({ id, value, timestamp }: Post) {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  return (
    <Frame
      paddingBottom="medium"
      paddingRight={spacing.horizontal}
      paddingLeft={spacing.horizontal}
    >
      <Frame
        marginTop={spacing.vertical}
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
      >
        <Frame
          flexDirection="row"
          alignItems="baseline"
          style={{
            height: "100%",
          }}
        >
          <Picture
            style={{
              borderRadius: theme.constants.absoluteRadius,
            }}
            lazyload={false}
            key={`picture-${id}`}
            width={theme.scales.larger}
            aspectRatio="square"
            resizeMode="cover"
            source="https://i.pravatar.cc/150"
          />
        </Frame>
        <Frame flexGrow={1} flex={1} paddingLeft="small">
          <PostTextContent value={value} />
        </Frame>
      </Frame>
      <Frame
        alignItems="flex-end"
        paddingTop="small"
        paddingRight={spacing.horizontal}
        paddingLeft={spacing.horizontal}
      >
        <Font variant="caption" color="foregroundSecondary">
          <FormattedDate
            value={timestampToDate(timestamp)}
            dateStyle="short"
            month="short"
            day="2-digit"
          />
        </Font>
      </Frame>
    </Frame>
  );
});

export { PostsList };

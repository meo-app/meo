import React, { useCallback } from "react";
import { FormattedDate } from "react-intl";
import { FlatList, FlatListProps, ListRenderItem } from "react-native";
import { Post } from "../api/Entities";
import { useHomeContext } from "../application/providers/HomeProvider";
import { useEdgeSpacing, useTheme } from "../application/providers/Theming";
import { timestampToDate } from "../utils/timestamp-to-date";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { PostTextContent } from "./PostTextContent";
import { UserAvatar } from "./UserAvatar";

const PostsList = React.memo(function PostsList({
  data,
  isBehindTabBar,
}: {
  data?: Post[];
  isBehindTabBar?: boolean;
}) {
  const theme = useTheme();
  const { setPostRef, tabBarHeight } = useHomeContext();
  const spacing = useEdgeSpacing();
  const keyExtractor = useCallback(({ id }: { id: string }) => String(id), []);

  const renderItem = useCallback<ListRenderItem<Post>>(
    ({ item, index }) => {
      // TODO: conditional wrap
      // TODO: fix this in search and home
      if (data && index === data.length - 1) {
        return (
          <Frame
            style={{
              paddingBottom: isBehindTabBar ? tabBarHeight : 0,
            }}
          >
            <PostLine {...item} />
            <Frame
              style={{
                height: isBehindTabBar ? tabBarHeight : 0,
              }}
            />
          </Frame>
        );
      }

      return <PostLine {...item} />;
    },
    [data, isBehindTabBar, tabBarHeight]
  );

  // const getItemLayout = useCallback<FlatListProps<Post>["getItemLayout"]>(
  //   (data, index) => {
  //     return {
  //       index,
  //       length: 200,
  //       offset: 200 * index,
  //     };
  //   },
  //   []
  // );

  if (!data?.length) {
    return null;
  }

  return (
    <FlatList<Post>
      ref={(ref) => setPostRef(ref)}
      windowSize={14}
      maxToRenderPerBatch={18}
      // removeClippedSubviews
      keyExtractor={keyExtractor}
      data={data}
      renderItem={renderItem}
      // getItemLayout={getItemLayout}
      contentContainerStyle={{
        paddingTop: theme.units[spacing.vertical],
      }}
      style={{
        backgroundColor: theme.colors.background,
      }}
    />
  );
});

const PostLine = React.memo(function PostLine({ value, timestamp }: Post) {
  const spacing = useEdgeSpacing();
  return (
    <Frame
      paddingBottom="smallest"
      paddingRight={spacing.horizontal}
      paddingLeft={spacing.horizontal}
      flexGrow={0}
    >
      <Frame
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
      >
        <Frame
          flexDirection="row"
          alignItems="flex-start"
          style={{
            height: "100%",
          }}
        >
          <UserAvatar />
        </Frame>
        <Frame flexGrow={1} flex={1} paddingLeft="small">
          <PostTextContent value={value} numberOfLines={5} />
        </Frame>
      </Frame>
      <Frame
        alignItems="flex-end"
        paddingTop="small"
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

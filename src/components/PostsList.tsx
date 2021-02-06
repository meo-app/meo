import React, { useCallback, useRef } from "react";
import { FormattedDate } from "react-intl";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  Platform,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InfiniteData } from "react-query";
import { Post } from "../api/Entities";
import { useEdgeSpacing, useTheme } from "../application/providers/Theming";
import { timestampToDate } from "../utils/timestamp-to-date";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { PostTextContent } from "./PostTextContent";
import { UserAvatar } from "./UserAvatar";

const PostsList = React.forwardRef<
  FlatList<Post>,
  { data?: InfiniteData<Post[]> } & Pick<
    FlatListProps<Post>,
    "refreshing" | "onEndReached"
  >
>(({ data, refreshing, onEndReached }, ref) => {
  const momentumRef = useRef(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const keyExtractor = useCallback(({ id }: { id: string }) => String(id), []);
  const renderItem = useCallback<ListRenderItem<Post>>(
    ({ item }) => <PostLine {...item} key={String(item.id)} />,
    []
  );

  if (!data?.pages?.length) {
    return null;
  }

  return (
    <FlatList<Post>
      refreshing={refreshing}
      onEndReachedThreshold={0.5}
      onMomentumScrollBegin={() => {
        momentumRef.current = true;
      }}
      onEndReached={(...args) => {
        if (momentumRef.current) {
          momentumRef.current = false;
          onEndReached?.call(null, ...args);
        }
      }}
      ref={ref}
      // removeClippedSubviews={Platform.OS === "ios"}
      ItemSeparatorComponent={null}
      scrollIndicatorInsets={{ right: 1 }}
      keyExtractor={keyExtractor}
      data={data.pages.flat(1)}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingTop: theme.units[spacing.vertical],
        paddingBottom: insets.bottom,
      }}
      style={{
        backgroundColor: theme.colors.background,
      }}
    />
  );
});

const POST_ITEM_HEIGHT = 100;
const PostLine = React.memo(function PostLine({ value, timestamp }: Post) {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  return (
    <Frame
      paddingBottom="smallest"
      paddingRight={spacing.horizontal}
      paddingLeft={spacing.horizontal}
      flexGrow={0}
      style={{
        paddingBottom: theme.units.medium,
        paddingTop: theme.units.medium,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.backgroundAccent,
        height: POST_ITEM_HEIGHT,
      }}
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
          <PostTextContent value={value} numberOfLines={3} />
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

export { PostsList, POST_ITEM_HEIGHT };

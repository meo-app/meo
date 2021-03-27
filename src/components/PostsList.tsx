import { NavigationProp, useNavigation } from "@react-navigation/native";
import { darken } from "polished";
import React, { useCallback, useMemo, useRef } from "react";
import { FormattedDate } from "react-intl";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  Platform,
  Pressable,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InfiniteData } from "react-query";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { timestampToDate } from "../shared/date-utils";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";
import { Post } from "../shared/SQLiteEntities";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { PostTextContent } from "./PostTextContent";
import { UserAvatar } from "./UserAvatar";

const PostsList = React.forwardRef<
  FlatList<Post>,
  { data?: InfiniteData<Post[]>; bottomSpacing?: number } & Pick<
    FlatListProps<Post>,
    "refreshing" | "onEndReached"
  >
>(({ data, refreshing, onEndReached, bottomSpacing }, ref) => {
  const posts = useMemo(() => data?.pages?.flat(1), [data?.pages]);
  const momentumRef = useRef(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const keyExtractor = useCallback(({ id }: { id: string }) => String(id), []);
  const renderItem = useCallback<ListRenderItem<Post>>(
    ({ item }) => <PostLine {...item} key={String(item.id)} />,
    []
  );

  if (posts && !posts.length) {
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
      ItemSeparatorComponent={null}
      ListFooterComponent={
        bottomSpacing ? (
          <View
            style={{
              height: bottomSpacing,
            }}
          />
        ) : null
      }
      scrollIndicatorInsets={{ right: 1 }}
      keyExtractor={keyExtractor}
      data={posts as Post[]}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingBottom: insets.bottom,
      }}
      style={{
        backgroundColor: theme.colors.background,
      }}
    />
  );
});

const POST_ITEM_HEIGHT = 130;
const PostLine = React.memo(function PostLine({ id, value, timestamp }: Post) {
  const { paddingHorizontal } = usePaddingHorizontal();
  const { navigate } = useNavigation<NavigationProp<NavigationParamsConfig>>();
  const date = useMemo(() => timestampToDate(timestamp), [timestamp]);
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => navigate("PostDetails", { id })}
      android_ripple={{
        color: darken(0.05, theme.colors.background),
      }}
      style={({ pressed }) => ({
        flex: 1,
        ...Platform.select({
          ios: {
            backgroundColor: pressed
              ? darken(0.05, theme.colors.background)
              : theme.colors.background,
          },
        }),
      })}
    >
      <Frame
        paddingHorizontal={paddingHorizontal}
        flexGrow={0}
        paddingBottom="small"
        paddingTop="medium"
      >
        <Frame
          justifyContent="flex-start"
          alignItems="center"
          flexDirection="row"
        >
          <Frame
            flexDirection="row"
            alignItems="flex-start"
            style={{ height: "100%" }}
          >
            <UserAvatar />
          </Frame>
          <Frame flexGrow={1} flex={1} paddingLeft="small">
            <PostTextContent value={value} numberOfLines={6} />
          </Frame>
        </Frame>
        <Frame
          alignItems="flex-end"
          paddingTop="small"
          paddingLeft={paddingHorizontal}
        >
          <Font variant="caption" color="foregroundSecondary">
            <FormattedDate
              value={date}
              dateStyle="medium"
              month="short"
              day="2-digit"
            />
          </Font>
        </Frame>
      </Frame>
    </Pressable>
  );
});

export { PostsList, POST_ITEM_HEIGHT };

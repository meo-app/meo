import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef } from "react";
import { FormattedDate } from "react-intl";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
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
  const posts = data?.pages?.flat(1);
  const momentumRef = useRef(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const keyExtractor = useCallback(({ id }: { id: string }) => String(id), []);
  const renderItem = useCallback<ListRenderItem<Post>>(
    ({ item, index }) => (
      <PostLine
        {...item}
        key={String(item.id)}
        bottomSpacing={
          index === (posts?.length ?? 0) - 1
            ? bottomSpacing || insets.bottom
            : 0
        }
      />
    ),
    [insets.bottom, bottomSpacing, posts?.length]
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
      scrollIndicatorInsets={{ right: 1 }}
      keyExtractor={keyExtractor}
      data={posts as Post[]}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingTop: theme.units.large,
        paddingBottom: insets.bottom,
      }}
      style={{
        backgroundColor: theme.colors.background,
      }}
    />
  );
});

const POST_ITEM_HEIGHT = 130;
const PostLine = React.memo(function PostLine({
  id,
  value,
  timestamp,
  bottomSpacing,
}: Post & {
  bottomSpacing?: number;
}) {
  const { paddingHorizontal } = usePaddingHorizontal();
  const { navigate } = useNavigation<NavigationProp<NavigationParamsConfig>>();
  const date = useMemo(() => timestampToDate(timestamp), [timestamp]);
  return (
    <Pressable onPress={() => navigate("PostDetails", { id })}>
      <Frame
        paddingHorizontal={paddingHorizontal}
        flexGrow={0}
        paddingBottom="small"
        paddingTop="small"
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
        {Boolean(bottomSpacing) && (
          <View
            style={{
              height: bottomSpacing,
            }}
          />
        )}
      </Frame>
    </Pressable>
  );
});

export { PostsList, POST_ITEM_HEIGHT };

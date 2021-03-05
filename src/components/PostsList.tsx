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
import { useEdgeSpacing, useTheme } from "../application/providers/Theming";
import { RootStackParamList, RootStackRoutes } from "../root-stack-routes";
import { Post } from "../shared/SQLiteEntities";
import { timestampToDate } from "../utils/timestamp-to-date";
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
  const spacing = useEdgeSpacing();
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
        paddingTop: theme.units[spacing.vertical],
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
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const date = useMemo(() => timestampToDate(timestamp), [timestamp]);
  return (
    <Pressable
      onPress={() => navigation.navigate(RootStackRoutes.PostDetails, { id })}
    >
      <Frame
        paddingRight={spacing.horizontal}
        paddingLeft={spacing.horizontal}
        flexGrow={0}
        style={{
          paddingBottom: theme.units.small,
          paddingTop: theme.units.small,
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

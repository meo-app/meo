import {
  NavigationProp,
  useNavigation,
  useScrollToTop,
} from "@react-navigation/native";
import React, { useMemo, useRef } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { Header } from "../components/Header";
import { PostsList } from "../components/PostsList";
import { usePaginatedPosts } from "../hooks/use-paginated-posts";
import { useResetScroll } from "../hooks/use-reset-scroll";
import { useAppContext } from "../providers/AppProvider";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";
import { QueryKeys } from "../shared/QueryKeys";

function Home() {
  const { data, error, fetchNextPage } = usePaginatedPosts({
    queryKey: QueryKeys.POSTS,
    queryFn: ({ limit, offset }) =>
      `select * from posts order by id desc limit ${limit}, ${offset}`,
  });
  const { navigate } = useNavigation<
    NavigationProp<NavigationParamsConfig, "Home">
  >();
  const isEmpty = useMemo(() => !data?.pages.flat(1).length, [data]);
  const { tabBarHeight } = useAppContext();
  const ref = useRef<FlatList | null>(null);
  useResetScroll(ref);
  useScrollToTop(ref);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Header title="Home" />
      {error && (
        <Frame flex={1 / 2} justifyContent="center" alignItems="center">
          <Font variant="body">There was an error, panic, panic</Font>
        </Frame>
      )}
      {data && isEmpty && (
        <Frame flex={1 / 2} justifyContent="center" alignItems="center">
          <Font variant="subtitle">Thought of something?</Font>
          <Frame marginTop="small">
            <Pressable onPress={() => navigate("Create")}>
              <Font color="primary">Add it here</Font>
            </Pressable>
          </Frame>
        </Frame>
      )}
      <PostsList
        data={data}
        ref={ref}
        onEndReached={() => fetchNextPage()}
        bottomSpacing={tabBarHeight}
      />
    </View>
  );
}

export { Home };

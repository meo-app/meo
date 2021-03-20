import { useScrollToTop } from "@react-navigation/native";
import React, { useMemo, useRef } from "react";
import { View } from "react-native";
import { Font } from "../components/Font";
import { Header } from "../components/Header";
import { PostsList } from "../components/PostsList";
import { QueryKeys } from "../shared/QueryKeys";
import { usePaginatedPosts } from "../hooks/use-paginated-posts";
import { useAppContext } from "../providers/AppProvider";
import { Frame } from "../components/Frame";

function Home() {
  const { data, error, fetchNextPage } = usePaginatedPosts(QueryKeys.POSTS, {
    queryFn: ({ limit, offset }) =>
      `select * from posts order by id desc limit ${limit}, ${offset}`,
  });

  const isEmpty = useMemo(() => !data?.pages.flat(1).length, [data]);
  const { tabBarHeight } = useAppContext();
  const ref = useRef(null);
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
            <Font>Add it here :)</Font>
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

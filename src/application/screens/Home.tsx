import { useScrollToTop } from "@react-navigation/native";
import React, { useRef } from "react";
import { View } from "react-native";
import { QueryIds } from "../../api/QueryIds";
import { usePaginatedPosts } from "../../api/use-paginated-posts";
import { Font } from "../../components/Font";
import { Header } from "../../components/Header";
import { PostsList } from "../../components/PostsList";

function Home() {
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
  } = usePaginatedPosts(QueryIds.posts, {
    queryFn: ({ limit, offset }) =>
      `select * from posts order by id desc limit ${limit}, ${offset}`,
  });

  const ref = useRef(null);
  useScrollToTop(ref);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Header title="Home" />
      {isFetching && (
        <View>
          <Font>TODO: loading state</Font>
        </View>
      )}
      {error && (
        <View
          style={{
            flex: 1,
          }}
        >
          <Font variant="body">There was an error!</Font>
        </View>
      )}
      {data && !data?.pages?.length && (
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Font variant="body">Thought of something? Add it here :)</Font>
        </View>
      )}
      <PostsList
        data={data}
        ref={ref}
        refreshing={isFetchingNextPage}
        onEndReached={() => fetchNextPage()}
      />
    </View>
  );
}

export { Home };

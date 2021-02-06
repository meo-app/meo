import { useScrollToTop } from "@react-navigation/native";
import React, { useRef } from "react";
import { View } from "react-native";
import { usePosts } from "../../api/usePosts";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { PostsList, POST_ITEM_HEIGHT } from "../../components/PostsList";
import { useAppContext } from "../providers/AppProvider";
import { useTheme } from "../providers/Theming";

function Home() {
  const {
    data,
    error,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePosts();
  console.log({ hasNextPage });
  const theme = useTheme();
  const ref = useRef(null);
  useScrollToTop(ref);
  const { tabBarHeight } = useAppContext();
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
      {/* {data && !data?.length && (
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Font variant="body">Thought of something? Add it here :)</Font>
        </View>
      )} */}
      <Frame
        backgroundColor={theme.colors.background}
        style={{
          height: "100%",
          paddingBottom: POST_ITEM_HEIGHT + tabBarHeight,
        }}
      >
        <PostsList
          data={data}
          ref={ref}
          refreshing={isFetchingNextPage}
          onEndReached={() => fetchNextPage()}
        />
      </Frame>
    </View>
  );
}

export { Home };

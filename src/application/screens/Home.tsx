import { useScrollToTop } from "@react-navigation/native";
import React, { useRef } from "react";
import { View } from "react-native";
import { usePosts } from "../../api/usePosts";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { PostsList } from "../../components/PostsList";
import { useTheme } from "../providers/Theming";

function Home() {
  const { data, error, isFetching } = usePosts();
  const theme = useTheme();
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
      {data && !data?.length && (
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
      <Frame
        backgroundColor={theme.colors.background}
        style={{
          height: "100%",
        }}
      >
        <PostsList data={data} isBehindTabBar ref={ref} />
      </Frame>
    </View>
  );
}

export { Home };

import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useRef } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon/Icon";
import { PostsList } from "../components/PostsList";
import { CreateButton } from "../components/TabBar";
import { usePaginatedPosts } from "../hooks/use-paginated-posts";
import { useResetScroll } from "../hooks/use-reset-scroll";
import { useAppContext } from "../providers/AppProvider";
import { useTheme } from "../providers/Theming";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";
import { QueryKeys } from "../shared/QueryKeys";

function HashtagViewer() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const ref = useRef<FlatList | null>(null);
  const route = useRoute<RouteProp<NavigationParamsConfig, "HashtagViewer">>();
  const { goBack, navigate } = useNavigation<
    NavigationProp<NavigationParamsConfig>
  >();
  const { tabBarHeight } = useAppContext();
  const { hashtag } = route.params;
  const { data, isError, fetchNextPage } = usePaginatedPosts({
    queryKey: [QueryKeys.HASHTAG_VIEWER, hashtag],
    queryFn: ({ limit, offset }) =>
      `select * from posts where id in (select post_id from hashtags where value like "%${hashtag}%") order by timestamp desc limit ${limit}, ${offset}`,
  });

  useResetScroll(ref);

  return (
    <>
      <Header hideBackground title={hashtag}>
        <Pressable
          onPress={() => goBack()}
          style={({ pressed }) => ({
            marginRight: theme.units.medium,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Icon type="Back" size="medium" />
        </Pressable>
        <Frame marginRight="medium" paddingRight="medium">
          <Font variant="display" numberOfLines={1}>
            {hashtag}
          </Font>
        </Frame>
      </Header>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        {isError && (
          <View
            style={{
              flex: 1,
            }}
          >
            <Font variant="body">There was an error!</Font>
          </View>
        )}

        <PostsList
          ref={ref}
          data={data}
          onEndReached={() => fetchNextPage()}
          bottomSpacing={tabBarHeight}
        />
        <Frame
          alignItems="center"
          justifyContent="center"
          style={{
            position: "absolute",
            width: "100%",
            bottom: insets.bottom + theme.units.medium,
          }}
        >
          <CreateButton
            onPress={() =>
              navigate("Create", {
                initialTextContent: `${hashtag} `,
                onPostCreateRoute: "HashtagViewer",
              })
            }
          />
        </Frame>
      </View>
    </>
  );
}

export { HashtagViewer };

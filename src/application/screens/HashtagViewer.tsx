import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Pressable, View } from "react-native";
import { QueryIds } from "../../api/QueryIds";
import { usePaginatedPosts } from "../../api/use-paginated-posts";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon/Icon";
import { PostsList } from "../../components/PostsList";
import { RootStackParamList, RootStackRoutes } from "../../root-stack-routes";
import { useTheme } from "../providers/Theming";

const Stack = createStackNavigator();

function HashtagViewer(props: {
  route: RouteProp<RootStackParamList, "HashtagViewer">;
}) {
  const theme = useTheme();
  const { hashtag } = props.route.params;
  const { data, isFetching, isError } = usePaginatedPosts(
    [QueryIds.hashtagViewer, hashtag],
    {
      queryFn: ({ limit, offset }) =>
        `select * from posts where id in (select post_id from hashtags where value like "%${hashtag}%") order by timestamp desc limit ${limit}, ${offset}`,
    }
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      {isFetching && (
        <View>
          <Font>TODO: loading state</Font>
        </View>
      )}
      {isError && (
        <View
          style={{
            flex: 1,
          }}
        >
          <Font variant="body">There was an error!</Font>
        </View>
      )}
      {data?.pages.length && <PostsList data={data} />}
    </View>
  );
}

function Screens() {
  const theme = useTheme();
  const route = useRoute<RouteProp<RootStackParamList, "HashtagViewer">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        header: () => (
          <Header hideBackground title={route.params.hashtag}>
            <Pressable
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                  return;
                }

                navigation.navigate(RootStackRoutes.Home);
              }}
              style={({ pressed }) => ({
                marginRight: theme.units.medium,
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Icon type="Back" size="medium" />
            </Pressable>
            <Frame marginRight="medium" paddingRight="medium">
              <Font variant="display" numberOfLines={1}>
                {route.params.hashtag}
              </Font>
            </Frame>
          </Header>
        ),
      }}
    >
      <Stack.Screen
        name={RootStackRoutes.HashtagViewer}
        component={HashtagViewer}
        initialParams={route.params}
      />
    </Stack.Navigator>
  );
}

export { Screens as HashtagViewer };

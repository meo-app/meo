import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Pressable, View } from "react-native";
import { QueryIds } from "../../api/QueryIds";
import { useTransaction } from "../../api/useTransaction";
import { Font } from "../../components/Font";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon/Icon";
import { PostsList } from "../../components/PostsList";
import { RootStackRoutes } from "../../root-stack-routes";
import { useTheme } from "../providers/Theming";

const Stack = createStackNavigator();

function HashtagViewer(props: { route: RouteProp<{}, ""> }) {
  const theme = useTheme();
  const { data } = useTransaction<{ total: string; value: string }>(
    QueryIds.hashtagViewer,
    `select * from posts where id in (select post_id from hashtags where value like "%${props.route.params.hashtag}%")`
  );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <PostsList data={data} />
      {/* <Font>{route?.params?.hashtag}</Font> */}
    </View>
  );
}

function Screens() {
  const route = useRoute();
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        header: (props) => (
          <Header {...props} hideBackground>
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
            <Font variant="display">{route?.params?.hashtag}</Font>
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

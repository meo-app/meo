import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import { usePosts } from "../../api/usePosts";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { PostsList } from "../../components/PostsList";
import { RouteNames } from "../../route-names";
import { useTheme } from "../providers/Theming";
import { useFlushOnboarding } from "../../api/onboarding";

const Stack = createStackNavigator();

function Home() {
  const { data, error, isFetching } = usePosts();
  const theme = useTheme();
  return (
    <View>
      {isFetching && (
        <View>
          <Font>TODO: loading state</Font>
        </View>
      )}
      {error && (
        <View>
          <Font>TODO: error state</Font>
        </View>
      )}
      {!Boolean(data?.length) && (
        <View>
          <Font>TODO: Empty view</Font>
        </View>
      )}
      <Frame backgroundColor={theme.colors.background}>
        <PostsList data={data} />
      </Frame>
    </View>
  );
}

function Root() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: Header,
        animationEnabled: false,
      }}
    >
      <Stack.Screen
        name={RouteNames.Home}
        component={Home}
        options={{
          animationEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

export { Root as Home };

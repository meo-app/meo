import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import { usePosts } from "../../api/usePosts";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { PostsList } from "../../components/PostsList";
import { RootStackRoutes } from "../../root-stack-routes";
import { useTheme } from "../providers/Theming";

const Stack = createStackNavigator();
function Home() {
  const { data, error, isFetching } = usePosts();
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
      }}
    >
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
      {!data?.length && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Font variant="body">There is nothing here yet</Font>
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
        name={RootStackRoutes.Home}
        component={Home}
        options={{
          animationEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

export { Root as Home };

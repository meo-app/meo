import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import "intl";
import "intl/locale-data/jsonp/en";
import React, { useEffect } from "react";
import { View, processColor } from "react-native";
import "react-native-gesture-handler";
import { usePostsFlatList } from "./application/providers/HomeProvider";
import { Providers } from "./application/providers/Providers";
import { Create } from "./application/screens/Create";
import { Home } from "./application/screens/Home";
import { Search } from "./application/screens/Search";
import { FloatingActions } from "./components/FloatingActions";
import { RouteNames } from "./route-names";
import { Settings } from "./application/screens/Settings";
import { useNavigation, useRoute } from "@react-navigation/native";

const Placeholder = () => <View style={{ flex: 1, backgroundColor: "blue" }} />;
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

/**
 * Force navigation to a specific route
 */
function ForceNavigationRoute({ route }: { route: string }) {
  // TODO: should only navigate on dev
  // TODO: should read route from env variable
  const navigation = useNavigation();
  useEffect(() => {
    navigation.navigate(route);
  }, []);

  return null;
}

function TabsNavigator() {
  const { postsRef } = usePostsFlatList();
  return (
    <>
      <ForceNavigationRoute route={"Settings"} />
      <Tab.Navigator
        tabBar={({ navigation, state }) => (
          <FloatingActions
            onSearchPress={() => navigation.navigate(RouteNames.Search)}
            onCreatePress={() => navigation.navigate(RouteNames.Create)}
            onHomePress={() => {
              if (/Home/.test(state.history[1]?.key)) {
                postsRef?.current?.scrollToIndex({
                  animated: true,
                  index: 0,
                });
              } else {
                navigation.navigate(RouteNames.Home);
              }
            }}
          />
        )}
      >
        <Tab.Screen name={RouteNames.Home} component={Home} />
        <Tab.Screen name={RouteNames.Search} component={Search} />
        <Tab.Screen
          name={RouteNames.Placeholder}
          component={Placeholder}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate(RouteNames.Create);
            },
          })}
        />
      </Tab.Navigator>
    </>
  );
}

function Root() {
  return (
    <RootStack.Navigator
      headerMode="none"
      mode="modal"
      screenOptions={{
        animationEnabled: true,
      }}
    >
      <RootStack.Screen name={RouteNames.Tabs} component={TabsNavigator} />
      <RootStack.Screen
        name={RouteNames.Create}
        component={Create}
        options={{ animationEnabled: true }}
      />
      <RootStack.Screen
        name={RouteNames.Settings}
        component={Settings}
        options={{ animationEnabled: false }}
      />
    </RootStack.Navigator>
  );
}

const App: React.FunctionComponent = function App() {
  return (
    <Providers>
      <Root />
    </Providers>
  );
};

export default App;

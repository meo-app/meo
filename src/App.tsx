import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "intl";
import "intl/locale-data/jsonp/en";
import React, { useEffect } from "react";
import { View } from "react-native";
import { usePostsFlatList } from "./application/providers/HomeProvider";
import { Providers } from "./application/providers/Providers";
import { Create } from "./application/screens/Create";
import { Home } from "./application/screens/Home";
import { Search } from "./application/screens/Search";
import { Settings } from "./application/screens/Settings";
import { FloatingActions } from "./components/FloatingActions";
import { RouteNames } from "./route-names";
import { Onboarding } from "./application/screens/Onboarding";

const Placeholder = () => <View style={{ flex: 1 }} />;
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

function TabsNavigator() {
  const { postsRef } = usePostsFlatList();
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          unmountOnBlur: false,
        }}
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
  const hasOnboarded = false;
  if (!hasOnboarded) {
    return <Onboarding />;
  }

  return (
    <RootStack.Navigator headerMode="none" mode="modal">
      <RootStack.Screen
        name={RouteNames.Tabs}
        component={TabsNavigator}
        options={{
          animationEnabled: false,
        }}
      />
      <RootStack.Screen
        name={RouteNames.Create}
        component={Create}
        options={{
          animationEnabled: true,
          gestureEnabled: false,
          transitionSpec: {
            close: {
              animation: "spring",
              config: {
                speed: 100,
              },
            },
            open: {
              animation: "spring",
              config: {
                speed: 100,
              },
            },
          },
        }}
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

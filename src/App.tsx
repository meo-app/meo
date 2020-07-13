import {
  NavigationContainer,
  NavigationContainerRef,
  Route,
  useNavigation,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useRef, useEffect, useState } from "react";
import "react-native-gesture-handler";
import { Providers } from "./application/providers/Providers";
import { Create } from "./application/screens/Create";
import { Home } from "./application/screens/Home";
import { Search } from "./application/screens/Search";
import { FloatingActions } from "./components/FloatingActions";
import { Header, SafeHeader } from "./components/Header";
import { Icon } from "./components/Icon/Icon";
import { RouteNames } from "./route-names";
import {
  TouchableHighlight,
  TouchableOpacity,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { View } from "react-native";
import { Frame } from "./components/Frame";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Placeholder = () => null;

const AppTabs = () => {
  return (
    <Tab.Navigator
      tabBar={({ navigation }) => (
        <FloatingActions
          onHomePress={() => navigation.navigate(RouteNames.Home)}
          onCreatePress={() => {
            navigation.emit<"tabPress">("tabPress");
            navigation.navigate(RouteNames.Create);
          }}
          onSearchPress={() => navigation.navigate(RouteNames.Search)}
        />
      )}
    >
      <Tab.Screen name={RouteNames.Home} component={Home} />
      <Tab.Screen
        name={RouteNames.Create}
        component={Placeholder}
        listeners={({ navigation }) => ({
          tabPress: () => {
            console.warn("ontabpress create");
          },
        })}
      />
      <Tab.Screen name={RouteNames.Search} component={Search} />
    </Tab.Navigator>
  );
};

function Root() {
  const ref = useRef<NavigationContainerRef>(null);
  return (
    <>
      <NavigationContainer ref={ref}>
        <Stack.Navigator mode="modal" headerMode="none">
          <Stack.Screen name="App" component={AppTabs} />
          <Stack.Screen name={RouteNames.Create} component={Create} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
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

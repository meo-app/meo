import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import React, { useReducer, useRef } from "react";
import { Animated, View, Text } from "react-native";
import "react-native-gesture-handler";
import { Providers } from "./application/providers/Providers";
import { Create } from "./application/screens/Create";
import { Home } from "./application/screens/Home";
import { Search } from "./application/screens/Search";
import { FloatingActions } from "./components/FloatingActions";
import { RouteNames } from "./route-names";
import { Header } from "./components/Header";

const Stack = createStackNavigator();

function Root() {
  const ref = useRef<NavigationContainerRef>(null);
  return (
    <NavigationContainer ref={ref}>
      <Stack.Navigator
        mode="modal"
        screenOptions={{
          header: Header,
        }}
      >
        <Stack.Screen name={RouteNames.Home} component={Home} />
        <Stack.Screen name={RouteNames.Create} component={Create} />
        <Stack.Screen name={RouteNames.Search} component={Search} />
      </Stack.Navigator>
      <FloatingActions
        onHomePress={() => {
          ref.current?.navigate(RouteNames.Home);
        }}
        onCreatePress={() => {
          ref.current?.navigate(RouteNames.Create);
        }}
        onSearchPress={() => {
          ref.current?.navigate(RouteNames.Search);
        }}
      />
    </NavigationContainer>
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

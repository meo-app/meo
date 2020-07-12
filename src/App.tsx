import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useRef } from "react";
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
} from "react-native-gesture-handler";

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
        <Stack.Screen
          name={RouteNames.Create}
          component={Create}
          options={{
            header: () => (
              <SafeHeader>
                <TouchableOpacity
                  onPress={() => ref.current?.navigate(RouteNames.Home)}
                >
                  <Icon type="Close" size="small" />
                </TouchableOpacity>
              </SafeHeader>
            ),
          }}
        />
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

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import "react-native-gesture-handler";
import { Providers } from "./application/providers/Providers";
import { Create } from "./application/screens/Create";
import { Home } from "./application/screens/Home";
import { Search } from "./application/screens/Search";
import { FloatingActions } from "./components/FloatingActions";
import { RouteNames } from "./route-names";

const Placeholder = () => <View style={{ flex: 1, backgroundColor: "blue" }} />;
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

const AppTabsNavigator = () => (
  <Tab.Navigator
    tabBar={({ navigation }) => (
      <FloatingActions
        onHomePress={() => navigation.navigate(RouteNames.Home)}
        onSearchPress={() => navigation.navigate(RouteNames.Search)}
        onCreatePress={() => navigation.navigate(RouteNames.Create)}
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
);

function Root() {
  return (
    <RootStack.Navigator
      headerMode="none"
      mode="modal"
      screenOptions={{
        animationEnabled: true,
      }}
    >
      <RootStack.Screen name="App" component={AppTabsNavigator} />
      <RootStack.Screen
        name={RouteNames.Create}
        component={Create}
        options={{ animationEnabled: true }}
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

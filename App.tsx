import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Animated } from "react-native";
import "react-native-gesture-handler";
import { Providers } from "./application/providers/Providers";
import { useTheme } from "./application/providers/Theming";
import { Create } from "./application/screens/Create";
import { Home } from "./application/screens/Home";

const Stack = createStackNavigator();

function Root() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        headerTitleStyle: {
          ...(theme.typography.display as React.ComponentProps<
            typeof Animated.Text
          >["style"]),
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Create" component={Create} />
    </Stack.Navigator>
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

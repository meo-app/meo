import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import "intl";
import "intl/locale-data/jsonp/en";
import React from "react";
import { View } from "react-native";
import { useHasSeenOnboarding } from "./api/onboarding";
import { usePostsFlatList } from "./application/providers/HomeProvider";
import { Providers } from "./application/providers/Providers";
import { useTheme } from "./application/providers/Theming";
import { Create } from "./application/screens/Create";
import { HashtagViewer } from "./application/screens/HashtagViewer";
import { Home } from "./application/screens/Home";
import { Onboarding } from "./application/screens/Onboarding/Onboarding";
import { Search } from "./application/screens/Search";
import { Settings } from "./application/screens/Settings";
import { FloatingActions } from "./components/FloatingActions";
import { RouteNames } from "./route-names";

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
  // TODO: pre fetch stuff
  const { data, isLoading } = useHasSeenOnboarding();
  const theme = useTheme();
  if (isLoading) {
    return null;
  }
  if (!data) {
    return <Onboarding />;
  }

  return (
    <RootStack.Navigator
      mode="modal"
      screenOptions={{
        headerTitle: () => null,
      }}
    >
      <RootStack.Screen
        name={RouteNames.Tabs}
        component={TabsNavigator}
        options={{
          animationEnabled: true,
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name={RouteNames.Create}
        component={Create}
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureEnabled: false,
          transitionSpec: {
            close: {
              animation: "spring",
              config: {
                speed: 200,
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
        options={{
          animationEnabled: true,
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <RootStack.Screen
        name={RouteNames.HashtagViewer}
        component={HashtagViewer}
        options={{
          animationEnabled: true,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardStyle: {
            borderWidth: 1,
            borderColor: theme.colors.backgroundAccent,
            ...theme.constants.shadow,
          },
        }}
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

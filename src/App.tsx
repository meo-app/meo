import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import "intl";
import "intl/locale-data/jsonp/en";
import React from "react";
import { Platform, View } from "react-native";
import { useHasSeenOnboarding } from "./api/onboarding";
import { useHomeContext } from "./application/providers/HomeProvider";
import { Providers } from "./application/providers/Providers";
import { useTheme } from "./application/providers/Theming";
import { Create } from "./application/screens/Create";
import { Explore } from "./application/screens/Explore";
import { HashtagViewer } from "./application/screens/HashtagViewer";
import { Home } from "./application/screens/Home";
import { Onboarding } from "./application/screens/Onboarding/Onboarding";
import { SearchResults } from "./application/screens/SearchResults";
import { Settings } from "./application/screens/Settings/Settings";
import { CustomDrawerContent } from "./components/CustomDrawerContent";
import { FloatingActions } from "./components/FloatingActions";
import { RootStackParamList, RootStackRoutes } from "./root-stack-routes";

const Placeholder = () => <View style={{ flex: 1 }} />;
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

const EXPLORE_REGEX = new RegExp(RootStackRoutes.Explore);
const HOME_REGEX = new RegExp(RootStackRoutes.Home);

function TabsNavigator() {
  const { postsRef } = useHomeContext();
  const theme = useTheme();
  return (
    <Tab.Navigator
      lazy={false}
      screenOptions={{
        unmountOnBlur: false,
      }}
      tabBar={({ navigation, state }) => (
        <FloatingActions
          onSearchPress={() => {
            if (EXPLORE_REGEX.test(state.history[1]?.key)) {
              navigation.navigate(RootStackRoutes.SearchResutls);
            } else {
              navigation.navigate(RootStackRoutes.Explore);
            }
          }}
          onCreatePress={() => navigation.navigate(RootStackRoutes.Create)}
          onHomePress={() => {
            if (HOME_REGEX.test(state.history[1]?.key)) {
              postsRef?.scrollToIndex({
                animated: true,
                index: 0,
                viewPosition: theme.units.largest,
              });
            } else {
              navigation.navigate(RootStackRoutes.Home);
            }
          }}
        />
      )}
    >
      <Tab.Screen name={RootStackRoutes.Home} component={Home} />
      <Tab.Screen name={RootStackRoutes.Explore} component={Explore} />
      <Tab.Screen
        name={RootStackRoutes.Placeholder}
        component={Placeholder}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate(RootStackRoutes.Create);
          },
        })}
      />
    </Tab.Navigator>
  );
}

function MainScreens() {
  const theme = useTheme();

  return (
    <RootStack.Navigator
      mode="modal"
      screenOptions={{
        headerTitle: () => null,
        headerTransparent: true,
      }}
    >
      <RootStack.Screen
        name={RootStackRoutes.Tabs}
        component={TabsNavigator}
        options={{
          animationEnabled: true,
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name={RootStackRoutes.Create}
        component={Create}
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureEnabled: false,
        }}
      />
      <RootStack.Screen
        name={RootStackRoutes.Settings}
        component={Settings}
        options={{
          animationEnabled: true,
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <RootStack.Screen
        name={RootStackRoutes.SearchResutls}
        component={SearchResults}
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
      <RootStack.Screen
        component={HashtagViewer}
        name={RootStackRoutes.HashtagViewer}
        options={{
          animationEnabled: true,
          gestureEnabled: Platform.OS === "ios",
          gestureDirection: "horizontal",
          headerShown: false,
          ...(Platform.OS === "ios" && {
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }),
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

function Root() {
  const theme = useTheme();
  // TODO: pre fetch stuff
  const { data, isLoading } = useHasSeenOnboarding();
  if (isLoading) {
    return null;
  }
  if (!data) {
    return <Onboarding />;
  }

  return (
    <Drawer.Navigator
      drawerStyle={{ backgroundColor: theme.colors.background }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name={RootStackRoutes.Placeholder}
        component={MainScreens}
      />
    </Drawer.Navigator>
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

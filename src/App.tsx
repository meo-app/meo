import { useFonts } from "@expo-google-fonts/inter";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  getFocusedRouteNameFromRoute,
  NavigationProp,
} from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import "intl";
import "intl/locale-data/jsonp/en";
import React, { useEffect, useMemo } from "react";
import { Platform } from "react-native";
import SplashScreen from "react-native-bootsplash";
import { Drawer } from "./components/Drawer";
import { TabBar } from "./components/TabBar";
import { Providers } from "./providers/Providers";
import { APP_FONTS } from "./providers/Theming/app-theme-definition";
import { useTheme } from "./providers/Theming/hooks/use-theme";
import { ChangeAvatar } from "./screens/ChangeAvatar";
import { Create } from "./screens/Create";
import { Explore } from "./screens/Explore/Explore";
import { HashtagViewer } from "./screens/HashtagViewer";
import { Home } from "./screens/Home";
import { Onboarding } from "./screens/Onboarding/Onboarding";
import { PostDetails } from "./screens/PostDetails";
import { SettingsAccentColorPicker } from "./screens/Settings/screens/SettingsAccentColorPicker";
import { Settings } from "./screens/Settings/Settings";
import { NavigationParamsConfig } from "./shared/NavigationParamsConfig";
import { useHasSeenOnboarding } from "./storage/onboarding";

const TabsNavigator = createBottomTabNavigator();
const DrawerNavigator = createDrawerNavigator<NavigationParamsConfig>();
const RootNavigator = createStackNavigator<NavigationParamsConfig>();

function Tabs() {
  return (
    <TabsNavigator.Navigator
      lazy={false}
      screenOptions={{ unmountOnBlur: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <TabsNavigator.Screen name="Home" component={Home} />
      <TabsNavigator.Screen name="Explore" component={Explore} />
    </TabsNavigator.Navigator>
  );
}

function Screens() {
  const theme = useTheme();
  const slideRightOptions = useMemo<
    React.ComponentProps<typeof RootNavigator.Screen>["options"]
  >(
    () => ({
      animationEnabled: true,
      gestureEnabled: Platform.OS === "ios",
      gestureDirection: "horizontal",
      headerShown: false,
      ...(Platform.OS === "ios" && {
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }),
      cardStyle: {
        ...theme.constants.shadow,
      },
    }),
    [theme.constants.shadow]
  );
  return (
    <RootNavigator.Navigator
      mode="modal"
      screenOptions={{
        headerTitle: () => null,
        headerTransparent: true,
        headerShown: false,
      }}
    >
      <RootNavigator.Screen
        name="Tabs"
        component={Tabs}
        options={{ animationEnabled: true }}
      />
      <RootNavigator.Screen
        name="Create"
        component={Create}
        options={slideRightOptions}
      />
      <RootNavigator.Screen
        name="Settings"
        component={Settings}
        options={{
          animationEnabled: true,
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <RootNavigator.Screen
        name="SettingsAccentColorPicker"
        component={SettingsAccentColorPicker}
      />
      <RootNavigator.Screen
        component={HashtagViewer}
        name="HashtagViewer"
        options={slideRightOptions}
      />
      <RootNavigator.Screen
        component={PostDetails}
        name="PostDetails"
        options={slideRightOptions}
      />
      <RootNavigator.Screen component={ChangeAvatar} name="ChangeAvatar" />
    </RootNavigator.Navigator>
  );
}

type TabRoutes = Extract<keyof NavigationParamsConfig, "Home" | "Explore">;
const ENABLE_DRAWER_SWIPE_ROUTE: TabRoutes[] = ["Explore", "Home"];

/**
 * TODO: <Root /> can pre-fetch posts/hashtags/avatar etc while holding splashscreen
 */
function Root() {
  const theme = useTheme();
  const { data, isLoading } = useHasSeenOnboarding();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide({ fade: true });
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  if (!data) {
    return <Onboarding />;
  }

  return (
    <DrawerNavigator.Navigator
      drawerStyle={{ backgroundColor: theme.colors.background }}
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        return {
          swipeEnabled: ENABLE_DRAWER_SWIPE_ROUTE.includes(
            String(routeName) as TabRoutes
          ),
        };
      }}
      drawerContent={({ navigation }) => (
        <Drawer
          navigation={
            (navigation as unknown) as NavigationProp<NavigationParamsConfig>
          }
        />
      )}
    >
      <DrawerNavigator.Screen name="Placeholder" component={Screens} />
    </DrawerNavigator.Navigator>
  );
}

const App: React.FunctionComponent = function App() {
  /**
   * Fonts needs to be loaded before anything renders
   */
  const [areFontsLoaded] = useFonts(APP_FONTS);
  if (!areFontsLoaded) {
    return null;
  }
  return (
    <Providers>
      <Root />
    </Providers>
  );
};

export default App;

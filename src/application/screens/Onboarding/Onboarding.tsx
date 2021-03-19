import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Pressable, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AvatarSelectionProvider,
  AvatarSelection,
} from "../../../components/AvatarSelection";
import { Font } from "../../../components/Font";
import { Frame } from "../../../components/Frame";
import { Picture } from "../../../components/Picture";
import { useCompleteOnboarding } from "../../../storage/onboarding";
import {
  STATUSBAR_BACKGROUND_COLOR,
  STATUS_BAR_SCHEME_MAP,
  ThemeProvider,
  useEdgeSpacing,
  useTheme,
} from "../../providers/Theming";
import {
  OnboardingNavigationProvider,
  RootStackRoutes,
  useOnboardingContext,
} from "./OnboardingContext";
import { OnboardingFadeInView } from "./OnboardingFadeInView";
import { OnboardingSlider } from "./OnboardingSlider";

function OnboardingBackgroundImage() {
  const theme = useTheme();
  return (
    <Picture
      source={require("../../../assets/bg-pattern.png")}
      resizeMode="cover"
      lazyload={false}
      style={{
        flex: 1,
        justifyContent: "center",
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 1,
        backgroundColor: theme.colors.background,
      }}
    />
  );
}

const Stack = createStackNavigator();

const OnboardingSliderScreen = () => (
  <OnboardingFadeInView screenIndex={0}>
    <OnboardingSlider />
  </OnboardingFadeInView>
);

const OnboardingAvatarSelectionScreen = () => (
  <OnboardingFadeInView screenIndex={1}>
    <AvatarSelection />
  </OnboardingFadeInView>
);

function Onboarding() {
  const safeArea = useSafeAreaInsets();
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const { back, next, finalize, disabled } = useOnboardingContext();
  const { mutate: completeOnboarding, status } = useCompleteOnboarding({
    onSuccess: finalize,
  });

  return (
    <Frame
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 2,
        backgroundColor: "transparent",
      }}
    >
      <Frame
        style={{
          height: safeArea.top,
        }}
      />
      <Stack.Navigator
        initialRouteName={RootStackRoutes.OnboardingSlider}
        screenOptions={{
          header: () => null,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          component={OnboardingSliderScreen}
          name={RootStackRoutes.OnboardingSlider}
        />
        <Stack.Screen
          component={OnboardingAvatarSelectionScreen}
          name={RootStackRoutes.AvatarSelection}
        />
      </Stack.Navigator>
      <Frame
        justifyContent="space-between"
        flexDirection="row"
        paddingRight={spacing.vertical}
        paddingLeft={spacing.vertical}
        style={{
          paddingTop: theme.units.large,
          paddingBottom: safeArea.bottom + theme.units.medium,
        }}
      >
        <Frame>
          {back && (
            <Pressable
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
              disabled={status !== "idle"}
              onPress={() => {
                back();
              }}
            >
              <Font color="primary">Back</Font>
            </Pressable>
          )}
        </Frame>
        <Frame>
          {next && (
            <Pressable
              onPress={() => {
                next?.();
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Font color="primary">Next</Font>
            </Pressable>
          )}
          {!next && (
            <Pressable
              disabled={status !== "idle" || disabled}
              onPress={() => completeOnboarding()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Font color="primary">Done</Font>
            </Pressable>
          )}
        </Frame>
      </Frame>
    </Frame>
  );
}

function Root() {
  return (
    <AvatarSelectionProvider>
      <ThemeProvider forceColorSchemeTo="dark">
        <StatusBar
          barStyle={STATUS_BAR_SCHEME_MAP.dark}
          backgroundColor={STATUSBAR_BACKGROUND_COLOR}
          translucent
        />
        <OnboardingNavigationProvider>
          <Onboarding />
          <OnboardingBackgroundImage />
        </OnboardingNavigationProvider>
      </ThemeProvider>
    </AvatarSelectionProvider>
  );
}

export { Root as Onboarding };

import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Pressable, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AvatarSelection,
  AvatarSelectionProvider,
} from "../../components/AvatarSelection";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Picture } from "../../components/Picture";
import {
  STATUSBAR_BACKGROUND_COLOR,
  STATUS_BAR_SCHEME_MAP,
  ThemeProvider,
  usePaddingHorizontal,
  useTheme,
} from "../../providers/Theming";
import { useCompleteOnboarding } from "../../storage/onboarding";
import {
  OnboardingNavigationProvider,
  OnboardingParamsConfig,
  useOnboardingContext,
} from "./OnboardingContext";
import { OnboardingSlider } from "./OnboardingSlider";

function OnboardingBackgroundImage() {
  const theme = useTheme();
  return (
    <Picture
      source={require("../../assets/bg-pattern.png")}
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

const Stack = createStackNavigator<OnboardingParamsConfig>();

const Spacing = React.memo(function Spacing({ children }) {
  const { paddingHorizontal } = usePaddingHorizontal();
  return (
    <Frame
      paddingHorizontal={paddingHorizontal}
      flex={1}
      paddingTop="large"
      paddingBottom="large"
    >
      {children}
    </Frame>
  );
});

const OnboardingSliderScreen = React.memo(function OnboardingSliderScreen() {
  return (
    <Spacing>
      <OnboardingSlider />
    </Spacing>
  );
});

const OnboardingAvatarSelectionScreen = React.memo(
  function OnboardingAvatarSelectionScreen() {
    return (
      <Spacing>
        <Font variant="display" textAlign="center">
          How do you look?
        </Font>
        <AvatarSelection />
      </Spacing>
    );
  }
);

function Onboarding() {
  const safeArea = useSafeAreaInsets();
  const theme = useTheme();
  const { paddingHorizontal } = usePaddingHorizontal();
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
        initialRouteName="OnboardingSlider"
        screenOptions={{
          header: () => null,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          component={OnboardingSliderScreen}
          name="OnboardingSlider"
        />
        <Stack.Screen
          component={OnboardingAvatarSelectionScreen}
          name="AvatarSelection"
        />
      </Stack.Navigator>
      <Frame
        justifyContent="space-between"
        flexDirection="row"
        paddingHorizontal={paddingHorizontal}
        style={{
          paddingTop: theme.units.large,
          paddingBottom: safeArea.bottom + theme.units.larger,
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
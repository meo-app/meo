import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useSafeArea } from "react-native-safe-area-context";
import { Font } from "../../../components/Font";
import { Frame } from "../../../components/Frame";
import { Picture } from "../../../components/Picture";
import {
  ThemeProvider,
  useEdgeSpacing,
  useTheme,
} from "../../providers/Theming";
import { OnboardingAvatarSelection } from "./OnboardingAvatarSelection";
import {
  OnboardingNavigationProvider,
  RouteNames,
  useOnboardingContext,
} from "./OnboardingContext";
import { OnboardingFadeInView } from "./OnboardingFadeInView";
import { OnboardingInsertName } from "./OnboardingInsertName";
import { OnboardingSlider } from "./OnboardingSlider";
import { useCompleteOnboarding } from "../../../api/onboarding";
import { Pressable, processColor } from "react-native";

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
  <OnboardingFadeInView screenIndex={0} bleed>
    <OnboardingSlider />
  </OnboardingFadeInView>
);

const OnboardingInsertNameScreen = () => (
  <OnboardingFadeInView screenIndex={1}>
    <OnboardingInsertName />
  </OnboardingFadeInView>
);

const OnboardingAvatarSelectionScreen = () => (
  <OnboardingFadeInView screenIndex={2}>
    <OnboardingAvatarSelection />
  </OnboardingFadeInView>
);

function Onboarding() {
  const safeArea = useSafeArea();
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const { back, next, finalize } = useOnboardingContext();
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
        initialRouteName={RouteNames.OnboardingSlider}
        screenOptions={{
          header: () => null,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          component={OnboardingSliderScreen}
          name={RouteNames.OnboardingSlider}
        />
        <Stack.Screen
          component={OnboardingInsertNameScreen}
          name={RouteNames.InsertName}
        />
        <Stack.Screen
          component={OnboardingAvatarSelectionScreen}
          name={RouteNames.AvatarSelection}
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
              // TODO: handle error
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
              // TODO: handle error
              disabled={status !== "idle"}
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
    <OnboardingNavigationProvider>
      <Onboarding />
      <OnboardingBackgroundImage />
    </OnboardingNavigationProvider>
  );
}

export { Root as Onboarding };
import React, { useState, useMemo } from "react";
import ViewPager from "@react-native-community/viewpager";
import { useSafeArea } from "react-native-safe-area-context";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Picture } from "../../components/Picture";
import { ThemeProvider, useEdgeSpacing, useTheme } from "../providers/Theming";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { createBottomStackNavigator } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionPresets,
  TransitionSpecs,
} from "@react-navigation/stack";
import { opacify } from "polished";

const Stack = createStackNavigator();

enum RouteNames {
  Onboarding = "Onboarding",
  NameSelection = "NameSelection",
  AvatarSelection = "AvatarSelection",
}

const OnboardingFrame: React.FunctionComponent = function OnboardingFrame({
  children,
}) {
  const spacing = useEdgeSpacing();
  return (
    <Frame
      justifyContent="center"
      alignItems="center"
      flex={1}
      paddingRight={spacing.horizontal}
      paddingLeft={spacing.horizontal}
    >
      {children}
    </Frame>
  );
};

const Indicators: React.FunctionComponent<{
  length: number;
  active: number;
}> = function Indicators({ length, active }) {
  const theme = useTheme();
  const items = useMemo(() => [...Array(length).keys()], [length]);
  return (
    <Frame alignItems="center" justifyContent="center" flexDirection="row">
      {items.map((item) => (
        <Frame
          key={item}
          marginLeft="small"
          marginRight="small"
          width="smaller"
          height="smaller"
          backgroundColor={
            active === item
              ? theme.colors.primary
              : theme.colors.foregroundPrimary
          }
          style={{
            borderRadius: theme.constants.absoluteRadius,
          }}
        />
      ))}
    </Frame>
  );
};

function Onboarding() {
  const safeArea = useSafeArea();
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const navigation = useNavigation();

  return (
    <>
      <Frame
        style={{
          height: safeArea.top,
        }}
      />
      <Frame flex={1}>
        <ViewPager
          initialPage={0}
          onPageSelected={(event) => setPage(event.nativeEvent.position)}
          style={{
            flexGrow: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <OnboardingFrame key="1">
            <Font variant="display">onboarding</Font>
          </OnboardingFrame>
          <OnboardingFrame key="2">
            <Font variant="display">content</Font>
          </OnboardingFrame>
          <OnboardingFrame key="3">
            <Font variant="display">goes here</Font>
          </OnboardingFrame>
        </ViewPager>
        <Indicators length={3} active={page} />
        <Frame
          justifyContent="flex-end"
          flexDirection="row"
          paddingRight={spacing.vertical}
          style={{
            paddingTop: theme.units.large,
            paddingBottom: safeArea.bottom + theme.units.medium,
          }}
        >
          <TouchableHighlight
            onPress={() => {
              navigation.navigate(RouteNames.AvatarSelection);
            }}
          >
            <Font color="primary">Skip</Font>
          </TouchableHighlight>
        </Frame>
      </Frame>
    </>
  );
}

function OnboardingImageBackground() {
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

function AvatarSelection() {
  return (
    <Frame
      debugTrace
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
    >
      <Font>Hello</Font>
    </Frame>
  );
}

function Root() {
  return (
    <ThemeProvider forceColorSchemeTo="dark" forceStatusBarTo="dark">
      <Frame
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 2,
          backgroundColor: "transparent",
        }}
      >
        <Stack.Navigator
          initialRouteName={RouteNames.Onboarding}
          screenOptions={{
            header: () => null,
            gestureEnabled: false,
            transitionSpec: {
              open: TransitionSpecs.TransitionIOSSpec,
              close: TransitionSpecs.TransitionIOSSpec,
            },
            cardStyleInterpolator: ({ current, next, ...rest }) => {
              const interpolator = CardStyleInterpolators.forHorizontalIOS({
                current,
                next,
                ...rest,
              });

              return {
                ...interpolator,
                cardStyle: {
                  ...interpolator.cardStyle,
                  opacity: (next ? next : current).progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: next ? [0, 0] : [0, 1],
                  }),
                },
              };
            },
          }}
        >
          <Stack.Screen component={Onboarding} name={RouteNames.Onboarding} />
          <Stack.Screen
            component={AvatarSelection}
            name={RouteNames.AvatarSelection}
          />
        </Stack.Navigator>
      </Frame>
      <OnboardingImageBackground />
    </ThemeProvider>
  );
}

export { Root as Onboarding };

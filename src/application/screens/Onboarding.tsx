import React, { useState, useMemo } from "react";
import ViewPager from "@react-native-community/viewpager";
import { useSafeArea } from "react-native-safe-area-context";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Picture } from "../../components/Picture";
import { ThemeProvider, useEdgeSpacing, useTheme } from "../providers/Theming";

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

  return (
    <>
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
          backgroundColor: theme.colors.background,
        }}
      />
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
            paddingBottom: safeArea.bottom,
          }}
        >
          <Font>Skip</Font>
        </Frame>
      </Frame>
    </>
  );
}

function Root() {
  return (
    <ThemeProvider forceColorSchemeTo="dark" forceStatusBarTo="dark">
      <Onboarding />
    </ThemeProvider>
  );
}

export { Root as Onboarding };

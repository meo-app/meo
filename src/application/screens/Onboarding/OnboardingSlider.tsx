import ViewPager from "@react-native-community/viewpager";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Font } from "../../../components/Font";
import { Frame } from "../../../components/Frame";
import { useTheme } from "../../providers/Theming";
import { OnboardingFadeInView } from "./OnboardingFadeInView";


const OnboardingFrame: React.FunctionComponent = function OnboardingFrame({
  children,
}) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        flex: 1,
        alignItems: "center",
        padding: 10,
      }}
    >
      {children}
    </View>
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

function OnboardingSlider() {
  const [page, setPage] = useState(0);
  return (
    <>
      <ViewPager
        initialPage={0}
        onPageSelected={(event) => setPage(event.nativeEvent.position)}
        style={{
          flexGrow: 2,
        }}
      >
        <OnboardingFrame key="1">
          <View
            style={{
              height: 500,
              width: 200,
              display: "flex",
            }}
          >
          </View>
          <Font variant="display">👋 👋 👋</Font>
          <Font variant="display">Welcome to Meo</Font>
          <Font variant="body">Your private feed of thoughts. Locally saved private by default.</Font>
        </OnboardingFrame>
        <OnboardingFrame key="2">
          <Font variant="display">📝 📝 📝</Font>
          <Font variant="display">A social feed-like experience</Font>
          <Font variant="body">Write your thoughts, ideas and browse them in a timeline form</Font>
        </OnboardingFrame>
        <OnboardingFrame key="3">
          <Font variant="display">#️⃣ #️⃣ #️⃣</Font>
          <Font variant="display">Easily orgnize things</Font>
          <Font variant="body">No more folders or tabs, just add a hastagh to your post and find them organized for you in the explore tab</Font>
        </OnboardingFrame>
      </ViewPager>
      <Indicators length={3} active={page} />
    </> 
  );
}

export { OnboardingSlider };

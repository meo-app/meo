import ViewPager from "@react-native-community/viewpager";
import React, { useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Picture } from "../../components/Picture";
import { usePaddingHorizontal } from "../../providers/Theming/hooks/use-padding-horizontal";
import { useTheme } from "../../providers/Theming/hooks/use-theme";

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
          width="smallest"
          height="smallest"
          backgroundColor={active === item ? "primary" : "foregroundPrimary"}
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
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { paddingHorizontal } = usePaddingHorizontal();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: "center",
          height: "100%",
        },
        slider: {
          flex: 1,
          justifyContent: "flex-start",
          padding: theme.units.large,
        },
      }),
    [theme.units.large]
  );
  return (
    <>
      <ViewPager
        initialPage={0}
        onPageSelected={(event) => setPage(event.nativeEvent.position)}
        style={styles.container}
      >
        <View key="1" style={styles.slider}>
          <Frame
            flexGrow={1}
            flexShrink={1}
            paddingBottom="medium"
            justifyContent="center"
            alignItems="center"
            style={{
              minWidth: width * 0.8,
            }}
          >
            <Picture
              resizeMode="contain"
              source={require("../../assets/onboarding/Saly-7.png")}
              aspectRatio="standard"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
              }}
            />
          </Frame>
          <Frame paddingBottom="medium">
            <Font
              variant="display"
              textAlign="center"
              marginBottom="small"
              paddingHorizontal={paddingHorizontal}
            >
              Welcome to Meo! 👋
            </Font>
            <Font variant="body" textAlign="center">
              Your private feed of thoughts. Locally saved private by default.
            </Font>
          </Frame>
        </View>
        <View key="2" style={styles.slider}>
          <Font
            variant="display"
            textAlign="center"
            marginBottom="large"
            paddingHorizontal={paddingHorizontal}
          >
            A social feed-like experience
          </Font>
          <Frame
            flexShrink={1}
            paddingBottom="medium"
            justifyContent="center"
            alignItems="center"
            style={{
              width: width * 0.8,
            }}
          >
            <Picture
              resizeMode="contain"
              source={require("../../assets/onboarding/Saly-14.png")}
              aspectRatio="standard"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
              }}
            />
          </Frame>
          <Font paddingHorizontal={paddingHorizontal} textAlign="center">
            It is like a social network, but it's just you...it's more like a
            notes app. You'll get it.
          </Font>
        </View>
        <View key="3" style={styles.slider}>
          <Frame
            flexGrow={1}
            paddingBottom="medium"
            justifyContent="center"
            alignItems="center"
            style={{
              width: width * 0.8,
            }}
          >
            <Picture
              resizeMode="contain"
              source={require("../../assets/onboarding/Saly-26.png")}
              aspectRatio="standard"
              style={{
                width: "100%",
                backgroundColor: "transparent",
              }}
            />
          </Frame>
          <Frame paddingBottom="medium" flexGrow={1}>
            <Font
              variant="display"
              textAlign="center"
              marginBottom="small"
              paddingHorizontal={paddingHorizontal}
            >
              Easily organize things
            </Font>
            <Font paddingHorizontal={paddingHorizontal} textAlign="center">
              No more folders, just add a hashtag to your post and find them
              organized for you in the explore tab
            </Font>
          </Frame>
        </View>
      </ViewPager>
      <Frame paddingBottom="large">
        <Indicators length={3} active={page} />
      </Frame>
    </>
  );
}

export { OnboardingSlider };

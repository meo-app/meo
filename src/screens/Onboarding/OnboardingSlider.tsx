import ViewPager from "@react-native-community/viewpager";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Picture } from "../../components/Picture";
import { useStyles } from "../../hooks/use-styles";
import { useTheme } from "../../providers/Theming";

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
          backgroundColor={active === item ? "primary" : "foregroundPrimary"}
          style={{
            borderRadius: theme.constants.absoluteRadius,
          }}
        />
      ))}
    </Frame>
  );
};

function Section({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <Font variant="display" textAlign="center" marginBottom="large">
        {title}
      </Font>
      <Font variant="body">{subtitle}</Font>
    </>
  );
}

function OnboardingSlider() {
  const [page, setPage] = useState(0);
  const styles = useStyles((theme) => ({
    container: {
      flex: 1,
      justifyContent: "center",
      height: "100%",
    },
    slider: {
      justifyContent: "center",
      alignItems: "center",
      padding: theme.units.large,
    },
  }));
  return (
    <>
      <ViewPager
        initialPage={0}
        onPageSelected={(event) => setPage(event.nativeEvent.position)}
        style={styles.container}
      >
        <View key="1" style={styles.slider}>
          <Section
            title="Welcome to Meo!"
            subtitle="Your private feed of thoughts. Locally saved private by default."
          />
        </View>
        <View key="2" style={styles.slider}>
          <Section
            title="A social feed-like experience"
            subtitle="It is like a social network, but its just you, so it isn't a social network... hmm its more like a notes app, but social but just you... you'll get it."
          />
        </View>
        <View key="3" style={styles.slider}>
          <Picture
            style={{
              width: 500,
              backgroundColor: "transparent",
            }}
            resizeMode="contain"
            lazyload={false}
            source={require("../../assets/hashtag.png")}
          />
          <Section
            title="Easily orgnize things"
            subtitle="No more folders, just add a hashtag to your post and find them organized for you in the explore tab"
          />
        </View>
      </ViewPager>
      <Indicators length={3} active={page} />
    </>
  );
}

export { OnboardingSlider };

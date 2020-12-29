import ViewPager from "@react-native-community/viewpager";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Font } from "../../../components/Font";
import { Frame } from "../../../components/Frame";
import { Picture } from "../../../components/Picture";
import { useStyles } from "../../../hooks/use-styles";
import { useEdgeSpacing, useTheme } from "../../providers/Theming";

const Indicators: React.FunctionComponent<{
  length: number;
  active: number;
}> = function Indicators({ length, active }) {
  const theme = useTheme();
  const items = useMemo(() => [...Array(length).keys()], [length]);
  return (
    <Frame alignItems="center" justifyContent="center" flexDirection="row">
      {items.map(item => (
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
            borderRadius: theme.constants.absoluteRadius
          }}
        />
      ))}
    </Frame>
  );
};

function OnboardingSlider() {
  const [page, setPage] = useState(0);
  const spacing = useEdgeSpacing();
  const styles = useStyles(theme => ({
    slider: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: theme.units[spacing.horizontal],
      paddingRight: theme.units[spacing.horizontal]
    }
  }));
  return (
    <>
      <ViewPager
        initialPage={0}
        onPageSelected={event => setPage(event.nativeEvent.position)}
        style={{
          flex: 1,
          justifyContent: "center",
          height: "100%"
        }}
      >
        <View key="1" style={styles.slider}>
          <Picture
            style={{
              width: 300,
              backgroundColor: "transparent"
            }}
            resizeMode="contain"
            lazyload={false}
            source={{
              uri: "https://i.imgur.com/a8r5TI3.gif"
            }}
          />
          <Font variant="display">👋 👋 👋</Font>
          <Font variant="display">Welcome to Meo</Font>
          <Font variant="body">
            Your private feed of thoughts. Locally saved private by default.
          </Font>
        </View>
        <View key="2" style={styles.slider}>
          <Font variant="display">📝 📝 📝</Font>
          <Font variant="display">A social feed-like experience</Font>
          <Font variant="body">
            It is like a social network, but its just you, so it isn't a social
            network.. hmm its more like a notes app, but social but just you...
            you'll get it
          </Font>
        </View>
        <View key="3" style={styles.slider}>
          <Picture
            style={{
              width: 500,
              backgroundColor: "transparent"
            }}
            resizeMode="contain"
            lazyload={false}
            source={require("../../../assets/hashtag.png")}
          />
          <Font variant="display">Easily orgnize things</Font>
          <Font variant="body">
            No more folders, just add a hashtag to your post and find them
            organized for you in the explore tab
          </Font>
        </View>
      </ViewPager>
      <Indicators length={3} active={page} />
    </>
  );
}

export { OnboardingSlider };

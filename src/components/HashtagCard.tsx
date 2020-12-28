import React from "react";
import { useStyles } from "../hooks/use-styles";
import { View } from "react-native";
import { Font } from "./Font";
import { StyleSheet } from "react-native";
import { opacify } from "polished";

function HashtagCard({ hashtag, total }: { hashtag: string; total: string }) {
  const styles = useStyles((theme) => ({
    root: {
      width: "100%",
    },
    content: {
      position: "relative",
      zIndex: 1,
      width: "100%",
      justifyContent: "flex-end",
      height: 160,
      borderRadius: theme.constants.borderRadius,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.backgroundAccent,
      backgroundColor: theme.colors.backgroundAccent,
      shadowColor: opacify(0.5, theme.colors.absoluteDark),
      padding: theme.units.medium,
      ...theme.constants.shadow,
    },
    decoration: {
      ...theme.constants.shadow,
      position: "absolute",
      borderRadius: theme.constants.borderRadius,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.backgroundAccent,
      backgroundColor: theme.colors.background,
      bottom: -10,
      width: "100%",
      height: 100,
      zIndex: 0,
    },
  }));
  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Font variant="display">{hashtag}</Font>
        <Font variant="caption">{total} thoughts</Font>
      </View>
      <View
        style={[
          styles.decoration,
          {
            bottom: -10,
            transform: [{ scale: 0.92 }],
          },
        ]}
      />
      <View
        style={[
          styles.decoration,
          {
            bottom: -5,
            transform: [{ scale: 0.96 }],
          },
        ]}
      />
    </View>
  );
}

export { HashtagCard };

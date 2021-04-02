import { opacify } from "polished";
import React, { useMemo, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useTheme } from "../providers/Theming";
import { Font } from "./Font";

const HEIGHT = 160;

function HashtagCard({ hashtag, total }: { hashtag: string; total: string }) {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          width: "100%",
        },
        content: {
          position: "relative",
          zIndex: 1,
          width: "100%",
          justifyContent: "flex-end",
          height: HEIGHT,
          borderRadius: theme.constants.borderRadius,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.backgroundAccent,
          backgroundColor: theme.colors.backgroundAccent,
          shadowColor: opacify(0.5, theme.colors.absoluteDark),
          padding: theme.units.medium,
          ...theme.constants.shadow,
        },
        decoration: {
          ...(Platform.OS === "ios" && {
            ...theme.constants.shadow,
          }),
          position: "absolute",
          borderRadius: theme.constants.borderRadius,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.backgroundAccent,
          backgroundColor:
            Platform.OS === "android"
              ? theme.colors.backgroundAccent
              : theme.colors.background,
          bottom: -10,
          width: "100%",
          height: 100,
          zIndex: 0,
        },
      }),
    [
      theme.colors.absoluteDark,
      theme.colors.background,
      theme.colors.backgroundAccent,
      theme.constants.borderRadius,
      theme.constants.shadow,
      theme.units.medium,
    ]
  );

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <HashTagDisplay>{hashtag}</HashTagDisplay>
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

const HashTagDisplay: React.FunctionComponent = function HashTagDisplay({
  children,
}) {
  const [props, setFontSettings] = useState<React.ComponentProps<typeof Font>>({
    color: "backgroundAccent",
    variant: "display",
  });
  return (
    <Font
      {...props}
      numberOfLines={2}
      onTextLayout={(event) => {
        if (
          event.nativeEvent.lines.length >= 2 &&
          props.color === "backgroundAccent"
        ) {
          setFontSettings({
            color: undefined,
            variant: "subtitle",
          });
        } else if (props.color === "backgroundAccent") {
          setFontSettings({
            color: undefined,
            variant: "display",
          });
        }
      }}
    >
      {children}
    </Font>
  );
};

HashtagCard.HEIGHT = HEIGHT;

export { HashtagCard };

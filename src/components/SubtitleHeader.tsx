import { useNavigation } from "@react-navigation/native";
import { rgba } from "polished";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEdgeSpacing, useTheme } from "../application/providers/Theming";
import { useStyles } from "../hooks/use-styles";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { Header } from "./Header";
import { Icon } from "./Icon/Icon";

interface Props extends React.ComponentProps<typeof Header> {
  title?: string;
  backContent?: React.ReactNode;
}

function SubtitleHeader({ title, backContent }: Props) {
  const navigation = useNavigation();
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const insets = useSafeAreaInsets();
  const styles = useStyles(() => ({
    spacer: {
      height: insets.top,
      width: "100%",
      backgroundColor: rgba(255, 255, 255, 0),
    },
    root: {
      paddingLeft: theme.units[spacing.horizontal],
      paddingRight: theme.units[spacing.horizontal],
      paddingBottom: theme.units.medium,
      display: "flex",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.backgroundAccent,
    },
  }));

  return (
    <Frame style={styles.root}>
      <Frame style={styles.spacer} />
      <Frame
        flexDirection="row"
        style={{
          width: "100%",
        }}
      >
        {navigation.canGoBack() &&
          (backContent ? (
            <Frame
              style={{
                zIndex: 1,
                marginRight: theme.units.medium,
                position: "absolute",
              }}
            >
              {backContent}
            </Frame>
          ) : (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
              style={({ pressed }) => ({
                zIndex: 1,
                marginRight: theme.units.medium,
                opacity: pressed ? 0.5 : 1,
                position: "absolute",
              })}
            >
              <Icon type="Back" size="medium" />
            </Pressable>
          ))}
        <Font
          variant="subtitle"
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          {title}
        </Font>
      </Frame>
    </Frame>
  );
}

export { SubtitleHeader };

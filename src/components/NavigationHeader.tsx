import { useNavigation } from "@react-navigation/native";
import { rgba } from "polished";
import React, { useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { Header } from "./Header";
import { Icon } from "./Icon/Icon";

interface Props extends React.ComponentProps<typeof Header> {
  title?: string | React.ReactNode;
  icon?: React.ComponentProps<typeof Icon>["type"];
  backContent?: React.ReactNode;
}

function NavigationHeader({
  title,
  backContent,
  icon = "Back",
  children,
}: Props) {
  const navigation = useNavigation();
  const theme = useTheme();
  const { paddingHorizontal } = usePaddingHorizontal();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        spacer: {
          height: insets.top,
          width: "100%",
          backgroundColor: rgba(255, 255, 255, 0),
        },
        root: {
          paddingHorizontal,
          paddingBottom: theme.units.large,
          display: "flex",
        },
      }),
    [insets.top, paddingHorizontal, theme.units]
  );

  const back = useMemo(() => {
    if (backContent) {
      return (
        <Frame
          marginRight="medium"
          style={{
            zIndex: 1,
            position: "absolute",
          }}
        >
          {backContent}
        </Frame>
      );
    }
    return (
      <Pressable
        onPress={() => navigation.goBack()}
        style={({ pressed }) => ({
          zIndex: 1,
          marginRight: theme.units.medium,
          opacity: pressed ? 0.5 : 1,
          position: "absolute",
        })}
      >
        <Icon type={icon} size="medium" />
      </Pressable>
    );
  }, [backContent, icon, navigation, theme.units.medium]);

  const content = useMemo(() => {
    if (children) {
      return children;
    }
    return (
      <Font
        variant="subtitle"
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        {title}
      </Font>
    );
  }, [children, title]);

  return (
    <Frame style={styles.root}>
      <Frame style={styles.spacer} />
      <Frame>
        {back}
        {content}
      </Frame>
    </Frame>
  );
}

export { NavigationHeader };

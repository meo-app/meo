import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { lighten, transparentize } from "polished";
import React, { useCallback, useMemo } from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import { Units } from "../foundations/Spacing";
import { useAppContext } from "../providers/AppProvider";
import {
  FlipColorScheme,
  usePaddingHorizontal,
  useTheme,
} from "../providers/Theming";
import { Frame, useFrame } from "./Frame";
import { Icon } from "./Icon/Icon";

const CREATE_BUTTON_SIZE: keyof Units = "larger";
const CREATE_BUTTON_DIMENSION = 1.3;

function TabBar({ navigation, state }: BottomTabBarProps) {
  const theme = useTheme();
  const { setTabBarHeight } = useAppContext();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 110,
        },
      }),
    []
  );

  const onPress = useCallback(
    (route: typeof state.routes[0]) => {
      /**
       * Needed so that `useScrollToTop` can capture the event on Home/Explore tabs
       */
      navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      navigation.navigate(route.name);
    },
    [navigation, state]
  );

  return (
    <Frame
      onLayout={(event) => {
        setTabBarHeight(
          event.nativeEvent.layout.height + theme.scales[CREATE_BUTTON_SIZE]
        );
      }}
      alignItems="baseline"
      justifyContent="space-evenly"
      style={styles.root}
    >
      <FlipColorScheme>
        <CreateButton onPress={() => navigation.navigate("Create")} />
      </FlipColorScheme>
      <Gradient>
        <Dock
          onHomePress={() => onPress(state.routes[0])}
          onExplorePress={() => onPress(state.routes[1])}
        />
      </Gradient>
    </Frame>
  );
}

const Gradient: React.FunctionComponent = function Gradient({ children }) {
  const theme = useTheme();
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.5 }}
      colors={[
        transparentize(1, theme.colors.background),
        theme.colors.background,
      ]}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 110,
        width: "100%",
      }}
    >
      <FlipColorScheme>{children}</FlipColorScheme>
    </LinearGradient>
  );
};

function Dock({
  onHomePress,
  onExplorePress,
}: {
  onHomePress: () => void;
  onExplorePress: () => void;
}) {
  const { paddingHorizontal } = usePaddingHorizontal();
  const theme = useTheme();
  const touch = useFrame({
    height: "larger",
    alignItems: "center",
    justifyContent: "center",
    style: {
      width: "100%",
    },
  });

  const touchable: PressableProps["style"] = useCallback(
    ({ pressed }) => ({
      ...touch,
      opacity: pressed ? 0.5 : 1,
    }),
    [touch]
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: theme.colors.background,
          marginRight: paddingHorizontal * 1.5,
          marginLeft: paddingHorizontal * 1.5,
          height: theme.scales.larger,
          borderRadius: theme.constants.absoluteRadius,
          ...theme.constants.shadow,
        },
      }),
    [
      paddingHorizontal,
      theme.colors.background,
      theme.constants.absoluteRadius,
      theme.constants.shadow,
      theme.scales.larger,
    ]
  );

  return (
    <Frame
      flexDirection="row"
      justifyContent="space-between"
      style={styles.root}
    >
      <Frame flexGrow={1}>
        <Pressable onPress={onHomePress} style={touchable}>
          <Icon type="Home" size="small" />
        </Pressable>
      </Frame>
      <Frame flexGrow={1}>
        <Pressable onPress={onExplorePress} style={touchable}>
          <Icon type="Search" size="small" />
        </Pressable>
      </Frame>
    </Frame>
  );
}

function CreateButton({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          top: -theme.scales[CREATE_BUTTON_SIZE] / CREATE_BUTTON_DIMENSION,
          zIndex: theme.constants.absoluteRadius,
          position: "absolute",
          width: "100%",
          ...theme.constants.shadow,
        },
        pressabe: {
          width: theme.scales[CREATE_BUTTON_SIZE],
          height: theme.scales[CREATE_BUTTON_SIZE],
          borderRadius: theme.constants.absoluteRadius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...theme.constants.shadow,
        },
      }),
    [theme.constants.absoluteRadius, theme.constants.shadow, theme.scales]
  );

  return (
    <Frame alignItems="center" pointerEvents="box-none" style={styles.root}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          ...styles.pressabe,
          backgroundColor: pressed
            ? lighten(0.1, theme.colors.background)
            : theme.colors.backgroundAccent,
        })}
      >
        <Icon type="Plus" size="small" />
      </Pressable>
    </Frame>
  );
}

export { TabBar };

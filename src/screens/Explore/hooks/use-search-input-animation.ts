import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const easeInOut = Easing.bezier(0.42, 0.0, 0.58, 1.0);
const easeInOutBack = Easing.bezier(0.68, -0.55, 0.265, 1.55);
const easeOutQuint = Easing.bezier(0.23, 1.0, 0.32, 1.0);

function useAnimatedvalue(value: number) {
  return useRef(new Animated.Value(value)).current;
}

function useSearchInputAnimation() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<"search" | "explore" | null>(null); // TODO: leave it as null
  const opacity = useAnimatedvalue(1);
  const translateY = useAnimatedvalue(0);
  const layout = useAnimatedvalue(0);
  const width = useMemo(
    () =>
      layout.interpolate({ inputRange: [0, 1], outputRange: ["100%", "80%"] }),
    [layout]
  );

  const translateX = useMemo(
    () => layout.interpolate({ inputRange: [0, 1], outputRange: [13, 0] }),
    [layout]
  );

  const shrink = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        useNativeDriver: true,
        duration: 140,
        easing: easeOutQuint,
      }),
      Animated.timing(translateY, {
        toValue: -insets.top,
        useNativeDriver: true,
        duration: 400,
        easing: easeInOutBack,
      }),
      Animated.timing(layout, {
        toValue: 1,
        useNativeDriver: false,
        duration: 400,
        easing: easeInOutBack,
      }),
    ]).start();
  }, [insets.top, layout, opacity, translateY]);

  const expand = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        useNativeDriver: true,
        easing: easeOutQuint,
        duration: 180,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        useNativeDriver: true,
        duration: 400,
        easing: easeInOut,
      }),
      Animated.timing(layout, {
        toValue: 0,
        useNativeDriver: false,
        duration: 400,
        easing: easeInOutBack,
      }),
    ]).start();
  }, [layout, opacity, translateY]);

  useEffect(() => {
    if (mode === "search") {
      shrink();
    } else {
      expand();
    }
  }, [expand, mode, shrink]);

  useEffect(() => {
    expand();
  }, [expand]);

  return {
    setMode,
    mode,
    opacity,
    width,
    translateX,
    translateY,
    scale: layout,
  };
}

export { useSearchInputAnimation };

import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useDebounceValue } from "../../hooks/use-debounce-value";
import { useTheme } from "../../providers/Theming";
import { useOnboardingContext } from "./OnboardingContext";

const duration = {
  in: 300,
  out: 200,
};

const OnboardingFadeInView: React.FunctionComponent<{
  screenIndex: number;
}> = function OnboardingFadeInView({ screenIndex, children }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const { index: currentIndex } = useOnboardingContext();
  const index = useDebounceValue(currentIndex, {
    delay: 80,
  });
  const isCurrentScreen = index === screenIndex;
  const theme = useTheme();
  useEffect(() => {
    const animate = Animated.timing(opacity, {
      toValue: isCurrentScreen ? 1 : 0,
      duration: isCurrentScreen ? duration.in : duration.out,
      useNativeDriver: true,
    });

    animate.start();
    return () => animate.stop();
  }, [index, isCurrentScreen, opacity, screenIndex]);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity,
        paddingTop: theme.units.large,
      }}
    >
      {children}
    </Animated.View>
  );
};

export { OnboardingFadeInView };

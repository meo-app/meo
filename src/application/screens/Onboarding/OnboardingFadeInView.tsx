import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useDebounce } from "../../../hooks/use-debounce";
import { useOnboardingContext } from "./OnboardingContext";
import { useEdgeSpacing, useTheme } from "../../providers/Theming";

const duration = {
  in: 300,
  out: 200,
};

const OnboardingFadeInView: React.FunctionComponent<{
  screenIndex: number;
  bleed?: boolean;
}> = function OnboardingFadeInView({ screenIndex, children, bleed }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const { index: currentIndex } = useOnboardingContext();
  const index = useDebounce(currentIndex, {
    delay: 80,
  });
  const isCurrentScreen = index === screenIndex;
  const spacing = useEdgeSpacing();
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
        ...(!bleed && {
          paddingLeft: theme.units[spacing.vertical],
          paddingRight: theme.units[spacing.vertical],
        }),
        paddingTop: theme.units[spacing.horizontal],
        paddingBottom: theme.units[spacing.horizontal],
      }}
    >
      {children}
    </Animated.View>
  );
};

export { OnboardingFadeInView };

import { Typography } from "../../../foundations/Typography";
import { useBreakpoint } from "../../../hooks/use-breakpoint";

const REDUCE_TYPOGRAPHY_BY = 0.87;
const DEFAULT_TYPOGRAPHY: Typography = {
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 22,
  },
  display: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    lineHeight: 22,
  },
  caption: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
  highlight: {
    fontFamily: "Inter_400Regular",
    fontSize: 20,
    lineHeight: 24,
  },
  strong: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
};

function useResponsiveTypography(): Typography {
  const breakpoint = useBreakpoint();
  if (breakpoint) {
    return Object.keys(DEFAULT_TYPOGRAPHY).reduce((acc, key) => {
      const current = key as keyof Typography;
      return {
        ...acc,
        [current]: {
          ...DEFAULT_TYPOGRAPHY[current],
          fontSize:
            (DEFAULT_TYPOGRAPHY[current]?.fontSize || 0) * REDUCE_TYPOGRAPHY_BY,
        },
      };
    }, {} as Typography);
  }

  return DEFAULT_TYPOGRAPHY;
}

export { useResponsiveTypography };

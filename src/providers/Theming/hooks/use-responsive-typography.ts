import { useBreakpoint } from "../../../hooks/use-breakpoint";
import { APP_TYPOGRAPHY } from "../app-theme-definition";

const REDUCE_TYPOGRAPHY_BY = 0.87;

function useResponsiveTypography(): typeof APP_TYPOGRAPHY {
  const breakpoint = useBreakpoint();
  if (breakpoint) {
    return Object.keys(APP_TYPOGRAPHY).reduce((acc, key) => {
      const current = key as keyof typeof APP_TYPOGRAPHY;
      return {
        ...acc,
        [current]: {
          ...APP_TYPOGRAPHY[current],
          fontSize:
            (APP_TYPOGRAPHY[current]?.fontSize || 0) * REDUCE_TYPOGRAPHY_BY,
        },
      };
    }, {} as typeof APP_TYPOGRAPHY);
  }

  return APP_TYPOGRAPHY;
}

export { useResponsiveTypography };

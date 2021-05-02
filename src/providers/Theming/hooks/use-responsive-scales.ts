import { Scales } from "../../../foundations/Spacing";
import { useBreakpoint } from "../../../hooks/use-breakpoint";
import { APP_SCALES } from "../app-theme-definition";

const REDUCE_SCALES_BY = 0.9;

function useResponsiveScales(): Scales {
  const breakpoint = useBreakpoint();
  if (breakpoint) {
    return Object.keys(APP_SCALES).reduce((acc, current) => {
      const key = current as keyof Scales;
      return {
        ...acc,
        [key]: APP_SCALES[key] * REDUCE_SCALES_BY,
      };
    }, {} as Scales);
  }

  return APP_SCALES;
}

export { useResponsiveScales };

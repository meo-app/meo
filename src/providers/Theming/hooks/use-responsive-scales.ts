import { Scales } from "../../../foundations/Spacing";
import { useBreakpoint } from "../../../hooks/use-breakpoint";

const REDUCE_SCALES_BY = 0.9;
const DEFAULT_SCALES: Scales = {
  smallest: 8,
  smaller: 16,
  small: 24,
  medium: 32,
  large: 48,
  larger: 64,
  largest: 72,
};

function useResponsiveScales(): Scales {
  const breakpoint = useBreakpoint();
  if (breakpoint) {
    return Object.keys(DEFAULT_SCALES).reduce((acc, current) => {
      const key = current as keyof Scales;
      return {
        ...acc,
        [key]: DEFAULT_SCALES[key] * REDUCE_SCALES_BY,
      };
    }, {} as Scales);
  }

  return DEFAULT_SCALES;
}

export { useResponsiveScales };

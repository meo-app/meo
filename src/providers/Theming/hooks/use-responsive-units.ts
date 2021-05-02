import { Units } from "../../../foundations/Spacing";
import { useBreakpoint } from "../../../hooks/use-breakpoint";
import { APP_UNITS } from "../app-theme-definition";

const REDUCE_UNITS_BY = 0.9;

function useResponsiveUnits(): Units {
  const breakpoint = useBreakpoint();
  if (breakpoint) {
    return Object.keys(APP_UNITS).reduce((acc, current) => {
      const key = current as keyof Units;
      return {
        ...acc,
        [key]: APP_UNITS[key] * REDUCE_UNITS_BY,
      };
    }, {} as Units);
  }

  return APP_UNITS;
}

export { useResponsiveUnits };

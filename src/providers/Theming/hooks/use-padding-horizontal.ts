import { useTheme } from "../Theming";

/**
 * Defines the horizontal padding used across
 * any screens or components on the whole app
 */
function usePaddingHorizontal() {
  const theme = useTheme();
  return {
    paddingHorizontal: theme.units.medium,
  };
}

export { usePaddingHorizontal };

import { useTheme } from "../../../providers/Theming";

function useAvatarSize() {
  const theme = useTheme();
  return theme.scales.large;
}

export { useAvatarSize };

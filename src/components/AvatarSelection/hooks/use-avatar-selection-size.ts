import { useTheme } from "../../../providers/Theming/hooks/use-theme";

function useAvatarSelectionSize() {
  const theme = useTheme();
  return theme.scales.largest * 1.4;
}

export { useAvatarSelectionSize };

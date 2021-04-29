import { useTheme } from "../../../providers/Theming/Theming";

function useAvatarSelectionSize() {
  const theme = useTheme();
  return theme.scales.largest * 1.4;
}

export { useAvatarSelectionSize };

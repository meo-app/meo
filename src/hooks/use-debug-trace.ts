import { useTheme } from "@react-navigation/native";
import { ViewStyle } from "react-native";

function useDebugTrace(): ViewStyle {
  return {
    // TODO: return nothing on prod env
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "red",
  };
}

export { useDebugTrace };

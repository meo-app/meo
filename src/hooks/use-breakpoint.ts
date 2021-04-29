import { useWindowDimensions } from "react-native";

const HEIGHT_THRESHOLD = 667;
function useBreakpoint() {
  const { height } = useWindowDimensions();
  return height < HEIGHT_THRESHOLD;
}

export { useBreakpoint };

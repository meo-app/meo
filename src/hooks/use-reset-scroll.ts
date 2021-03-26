import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useCallback } from "react";
import { FlatList } from "react-native";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";

function useResetScroll(flatlist: React.MutableRefObject<FlatList | null>) {
  const { setParams } = useNavigation<
    NavigationProp<NavigationParamsConfig, "Home" | "Explore">
  >();
  const { params, name } = useRoute<
    RouteProp<NavigationParamsConfig, "Home" | "Explore">
  >();
  const effect = useCallback(() => {
    console.log({ name });
    if (params?.resetScroll) {
      flatlist.current?.scrollToOffset({ offset: 0, animated: true });
    }
    setParams({ resetScroll: false });
  }, [flatlist, name, params?.resetScroll, setParams]);

  useFocusEffect(effect);
}

export { useResetScroll };

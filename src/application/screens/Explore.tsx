import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  ListRenderItem,
  Pressable as RNPressable,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { HashtagCard } from "../../components/HashtagCard";
import { Header } from "../../components/Header";
import { OpenDrawerButton } from "../../components/OpenDrawerButton";
import { SearchTextInput } from "../../components/SearchTextInput";
import { RootStackParamList, RootStackRoutes } from "../../root-stack-routes";
import { QueryIds } from "../../sqlite/QueryIds";
import { useTransaction } from "../../sqlite/use-transaction";
import { useAppContext } from "../providers/AppProvider";
import { useSearchContext } from "../providers/SearchProvider";
import { useEdgeSpacing, useTheme } from "../providers/Theming";

const Pressable = Animated.createAnimatedComponent(
  RNPressable
) as typeof RNPressable;

interface HashtagCount {
  total: string;
  value: string;
}

function Explore() {
  const [mode, setMode] = useState<"search" | "explore">("explore");
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  const { tabBarHeight } = useAppContext();
  const { term, onChangeText, setIsFocused } = useSearchContext();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { data: hashtags } = useTransaction<HashtagCount>(
    QueryIds.topHashtags,
    "select count(value) as total, value from hashtags group by value order by total desc"
  );

  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const width = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const widthInterpolation = useMemo(
    () =>
      width.interpolate({ inputRange: [0, 1], outputRange: ["100%", "80%"] }),
    [width]
  );
  const translateXInterpolation = useMemo(
    () => width.interpolate({ inputRange: [0, 1], outputRange: [13, 0] }),
    [width]
  );

  useEffect(() => {
    if (mode === "search") {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          useNativeDriver: true,
          duration: 140,
          easing: Easing.bezier(0.23, 1.0, 0.32, 1.0),
        }),
        Animated.timing(translateY, {
          toValue: -insets.top - 10,
          useNativeDriver: true,
          duration: 400,
          easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
        }),
        Animated.timing(width, {
          toValue: 1,
          useNativeDriver: false,
          duration: 400,
          easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          useNativeDriver: true,
          easing: Easing.bezier(0.23, 1.0, 0.32, 1.0),
          duration: 180,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          useNativeDriver: true,
          duration: 250,
          easing: Easing.bezier(0.42, 0.0, 0.58, 1.0),
        }),
        Animated.timing(width, {
          toValue: 0,
          useNativeDriver: false,
          duration: 400,
          easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
        }),
      ]).start();
    }
  }, [insets.top, mode, opacity, translateY, width]);

  const renderItem = useCallback<ListRenderItem<HashtagCount>>(
    ({ item, index }) => (
      <Pressable
        style={{
          flex: 1 / 2,
          marginLeft: theme.units[spacing.horizontal],
          marginTop: theme.units[spacing.horizontal],
          ...(index % 2 && {
            marginRight: theme.units[spacing.horizontal],
          }),
        }}
        key={String(item.value + item.total)}
        onPress={() => {
          navigation.navigate(RootStackRoutes.HashtagViewer, {
            hashtag: item.value,
          });
        }}
      >
        <HashtagCard hashtag={item.value} total={item.total} />
      </Pressable>
    ),
    [navigation, spacing.horizontal, theme.units]
  );

  const keyExtractor = useCallback(({ value }: HashtagCount) => value, []);

  return (
    <Frame
      flexDirection="column"
      backgroundColor={theme.colors.background}
      flex={1}
    >
      <Animated.View
        style={{
          flexDirection: "column",
          width: "100%",
          display: "flex",
          transform: [
            {
              translateY,
            },
          ],
        }}
      >
        <Header>
          <View style={{ flex: 1 }}>
            <Animated.View
              style={{
                opacity,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <OpenDrawerButton />
              <Font variant="display">Explore</Font>
            </Animated.View>
            <View
              style={{
                zIndex: 1,
                marginTop: theme.units.medium,
                display: "flex",
                position: "relative",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Animated.View
                style={{
                  // flex: 1,
                  width: widthInterpolation,
                  transform: [
                    {
                      translateX: translateXInterpolation,
                    },
                  ],
                }}
              >
                <SearchTextInput
                  style={{
                    width: "100%",
                  }}
                  value={term}
                  onChangeText={onChangeText}
                  editable
                  // pointerEvents="box-none"
                  onFocus={() => {
                    setMode("search");
                  }}
                  onBlur={() => {
                    // setMode("explore");
                  }}
                />
              </Animated.View>
              <Animated.View
                style={{
                  // padding: theme.units.medium,
                  padding: 0,
                  // width: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [
                    {
                      scale: width,
                      // translateX: 1,
                    },
                  ],
                }}
              >
                <Pressable
                  onPress={() => {
                    setMode("explore");
                  }}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                    flexDirection: "row",
                    alignItems: "center",
                  })}
                >
                  <Font variant="body" color="primary">
                    Cancel
                  </Font>
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </Header>
      </Animated.View>
      <Animated.View
        style={{
          transform: [{ translateY }],
        }}
      >
        <FlatList
          contentContainerStyle={{
            paddingBottom: tabBarHeight + HashtagCard.HEIGHT,
          }}
          keyExtractor={keyExtractor}
          data={hashtags}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{
            flex: 1,
          }}
        />
      </Animated.View>
    </Frame>
  );
}

export { Explore };

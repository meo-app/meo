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
  Keyboard,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Pressable,
  View,
} from "react-native";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Font } from "../../../components/Font";
import { Frame } from "../../../components/Frame";
import { HashtagCard } from "../../../components/HashtagCard";
import { Header } from "../../../components/Header";
import { OpenDrawerButton } from "../../../components/OpenDrawerButton";
import { PostsList } from "../../../components/PostsList";
import { SearchTextInput } from "../../../components/SearchTextInput";
import { useDebounce } from "../../../hooks/use-debounce";
import {
  RootStackParamList,
  RootStackRoutes,
} from "../../../root-stack-routes";
import { QueryIds } from "../../../sqlite/QueryIds";
import { usePaginatedPosts } from "../../../sqlite/use-paginated-posts";
import { useTransaction } from "../../../sqlite/use-transaction";
import { useAppContext } from "../../providers/AppProvider";
import { useEdgeSpacing, useTheme } from "../../providers/Theming";
import { useSearchInputAnimation } from "./hooks/use-search-input-animation";

const KeyboardAvoidingView = Animated.createAnimatedComponent(
  RNKeyboardAvoidingView
);

interface HashtagCount {
  total: string;
  value: string;
}

function Explore() {
  const {
    opacity,
    setMode,
    width,
    translateX,
    translateY,
    scale,
    mode,
  } = useSearchInputAnimation();
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  const { tabBarHeight } = useAppContext();
  const [term, onChangeText] = useState("");
  const searchInputRef = useRef(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const value = useDebounce(term, { delay: 300 });

  useEffect(() => {
    setMode("explore");
  }, [setMode]);

  const { data: hashtags } = useTransaction<HashtagCount>(
    QueryIds.topHashtags,
    "select count(value) as total, value from hashtags group by value order by total desc"
  );

  const { data, isFetched, fetchNextPage } = usePaginatedPosts(
    [QueryIds.search, value],
    {
      queryFn: ({ limit, offset }) =>
        `select * from posts where value like "%${value}%" collate nocase order by id desc limit ${limit}, ${offset}`,
      enabled: mode === "search",
    }
  );

  const displayNoSearchResults = useMemo(() => {
    const results = data?.pages.flat(1).length;
    return mode === "search" && isFetched && Boolean(term) && !results;
  }, [data?.pages, isFetched, mode, term]);

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
                  width,
                  transform: [
                    {
                      translateX,
                    },
                  ],
                }}
              >
                <SearchTextInput
                  ref={searchInputRef}
                  value={term}
                  onChangeText={onChangeText}
                  editable
                  onTouchStart={() => {
                    setMode("search");
                  }}
                  onFocus={() => {
                    setMode("search");
                  }}
                />
              </Animated.View>
              <Animated.View
                style={{
                  padding: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [
                    {
                      scale,
                    },
                  ],
                }}
              >
                <Pressable
                  onPress={() => {
                    // @ts-ignore rn refs doesnt export types
                    searchInputRef.current?.blur();
                    setMode("explore");
                    onChangeText("");
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
          position: "relative",
          transform: [{ translateY }],
        }}
      >
        {mode === "explore" && (
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
        )}
        {mode === "search" && (
          <PostsList data={data} onEndReached={() => fetchNextPage()} />
        )}
      </Animated.View>
      {displayNoSearchResults && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            transform: [{ translateY }],
          }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Font variant="subtitle">Ops can't find that</Font>
            <Frame marginTop="small">
              <Font>Try a new search.</Font>
            </Frame>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </Frame>
  );
}

export { Explore };

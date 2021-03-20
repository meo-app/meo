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
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { HashtagCard } from "../../components/HashtagCard";
import { Header } from "../../components/Header";
import { OpenDrawerButton } from "../../components/OpenDrawerButton";
import { PostsList } from "../../components/PostsList";
import { SearchTextInput } from "../../components/SearchTextInput";
import { useDebounceValue } from "../../hooks/use-debounce-value";
import { usePaginatedPosts } from "../../hooks/use-paginated-posts";
import { useSQLiteQuery } from "../../hooks/use-sqlite-query";
import { useAppContext } from "../../providers/AppProvider";
import { usePaddingHorizontal, useTheme } from "../../providers/Theming";
import { QueryKeys } from "../../shared/QueryKeys";
import { NavigationParamsConfig } from "../../shared/NavigationParamsConfig";
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
  const { paddingHorizontal } = usePaddingHorizontal();
  const theme = useTheme();
  const { tabBarHeight } = useAppContext();
  const [term, onChangeText] = useState("");
  const searchInputRef = useRef(null);
  const { navigate } = useNavigation<NavigationProp<NavigationParamsConfig>>();
  const value = useDebounceValue(term, { delay: 300 });

  useEffect(() => {
    setMode("explore");
  }, [setMode]);

  const { data: hashtags } = useSQLiteQuery<HashtagCount>(
    QueryKeys.TOP_HASHTAGS,
    "select count(value) as total, value from hashtags group by value order by total desc"
  );

  const { data, isFetched, fetchNextPage } = usePaginatedPosts(
    [QueryKeys.SEARCH, value],
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
          marginLeft: paddingHorizontal,
          marginTop: paddingHorizontal,
          ...(index % 2 && {
            marginRight: paddingHorizontal,
          }),
        }}
        key={String(item.value + item.total)}
        onPress={() => navigate("HashtagViewer", { hashtag: item.value })}
      >
        <HashtagCard hashtag={item.value} total={item.total} />
      </Pressable>
    ),
    [navigate, paddingHorizontal]
  );

  const keyExtractor = useCallback(({ value }: HashtagCount) => value, []);

  return (
    <Frame flexDirection="column" backgroundColor="background" flex={1}>
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
      {Boolean(!hashtags?.length) && mode === "explore" && (
        <Frame flex={1 / 2} justifyContent="center" alignItems="center">
          <Font variant="subtitle">Hashtags shows up here</Font>
          <Font variant="body" marginTop="small">
            Tag any post to start
          </Font>
        </Frame>
      )}
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
            flex: 1 / 2,
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

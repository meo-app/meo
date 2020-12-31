import {
  EventListenerCallback,
  EventMapCore,
  NavigationContainerRef,
  NavigationState,
  useNavigation,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Pressable, TextInputProps } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { QueryIds } from "../../api/QueryIds";
import { useSearch } from "../../api/useSearch";
import { useTransaction } from "../../api/useTransaction";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Grid } from "../../components/Grid";
import { HashtagCard } from "../../components/HashtagCard";
import { Header } from "../../components/Header";
import { OpenDrawerButton } from "../../components/OpenDrawerButton";
import { PostsList } from "../../components/PostsList";
import { SearchTextInput } from "../../components/SearchTextInput";
import { RootStackRoutes } from "../../root-stack-routes";
import { assert } from "../../utils/assert";
import { useEdgeSpacing, useTheme } from "../providers/Theming";

const Stack = createStackNavigator();

enum SearchStackRoutes {
  Search = "Search",
  SearchResults = "SearchResults",
}

type SearchStackParamsList = {
  Search: undefined;
  SearchResults: undefined;
};

const Context = createContext<
  | ({
      isFocused: boolean;
      setIsFocused: (value: boolean) => void;
      term: string;
    } & Required<Pick<TextInputProps, "onChangeText">>)
  | null
>(null);

const SearchContext: React.FunctionComponent = function SearchContext({
  children,
}) {
  const [term, onChangeText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Context.Provider
      value={{
        term,
        onChangeText: onChangeText,
        isFocused,
        setIsFocused,
      }}
    >
      {children}
    </Context.Provider>
  );
};

function useSearchContext() {
  const context = useContext(Context);
  assert(context, "Could not find search context");
  return context;
}

function Search() {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  const { term, onChangeText, setIsFocused } = useSearchContext();
  // TODO: type with combine
  const navigation = useNavigation();
  const { data: hashtags } = useTransaction<{ total: string; value: string }>(
    QueryIds.topHashtags,
    "select count(value) as total, value from hashtags group by value order by total desc limit 4"
  );

  return (
    <Frame
      flexDirection="column"
      backgroundColor={theme.colors.background}
      flex={1}
    >
      <Header title="Explore">
        <Frame
          flexDirection="column"
          style={{
            width: "100%",
          }}
        >
          <Frame flexDirection="row">
            <OpenDrawerButton />
            <Font variant="display">Explore</Font>
          </Frame>
          <Frame
            marginTop="medium"
            style={{
              width: "100%",
            }}
          >
            <SearchTextInput
              value={term}
              onChangeText={onChangeText}
              onFocus={() => {
                navigation.navigate(SearchStackRoutes.SearchResults);
                setIsFocused(true);
              }}
            />
          </Frame>
        </Frame>
      </Header>
      <ScrollView
        style={{
          paddingTop: theme.units[spacing.horizontal],
          paddingBottom: theme.units[spacing.horizontal],
        }}
      >
        <Grid
          gap="medium"
          numColumns={2}
          margin={theme.units[spacing.horizontal]}
        >
          {hashtags?.map((item) => (
            <Pressable
              key={String(item.value + item.total)}
              onPress={() => {
                navigation.navigate(RootStackRoutes.HashtagViewer, {
                  hashtag: item.value,
                });
              }}
            >
              <HashtagCard hashtag={item.value} total={item.total} />
            </Pressable>
          ))}
        </Grid>
      </ScrollView>
    </Frame>
  );
}

function SearchResults() {
  const { term, onChangeText, setIsFocused } = useSearchContext();
  const theme = useTheme();
  const navigation = useNavigation();
  const { data } = useSearch(term);
  return (
    <Frame flex={1}>
      <Header title="Explore">
        <Frame
          flexDirection="row"
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Frame
            style={{
              flex: 1,
            }}
          >
            <SearchTextInput
              value={term}
              autoFocus
              onChangeText={onChangeText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                if (data && data.length) {
                  return;
                }

                if (!term) {
                  navigation.navigate(SearchStackRoutes.Search);
                }
              }}
            />
          </Frame>
          <Pressable
            onPress={() => navigation.navigate(SearchStackRoutes.Search)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: theme.units.medium,
            })}
          >
            <Font variant="body" color="primary">
              Cancel
            </Font>
          </Pressable>
        </Frame>
      </Header>
      <Frame flex={1} backgroundColor={theme.colors.background}>
        <PostsList data={data} />
      </Frame>
    </Frame>
  );
}

function Screens() {
  const navigation = useNavigation();
  const { term } = useSearchContext();
  const searchNavigationRef = useRef<NavigationContainerRef | null>(null);
  useEffect(() => {
    const listener: EventListenerCallback<
      EventMapCore<NavigationState>,
      "blur"
    > = () => {
      if (!term) {
        searchNavigationRef.current?.navigate(SearchStackRoutes.Search);
      }
    };
    navigation.addListener("blur", listener);
    return () => navigation.removeListener("blur", listener);
  }, [navigation, term]);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={SearchStackRoutes.Search} component={Search} />
      <Stack.Screen
        name={SearchStackRoutes.SearchResults}
        component={SearchResults}
      />
    </Stack.Navigator>
  );
}

function Root() {
  return (
    <SearchContext>
      <Screens />
    </SearchContext>
  );
}

export { Root as Search };

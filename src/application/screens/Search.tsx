import { createStackNavigator } from "@react-navigation/stack";
import React, { createContext, useContext, useEffect, useState } from "react";
import { TextInputProps, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { QueryIds } from "../../api/QueryIds";
import { useSearch } from "../../api/useSearch";
import { useTransaction } from "../../api/useTransaction";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Grid } from "../../components/Grid";
import { HashtagCard } from "../../components/HashtagCard";
import { Header } from "../../components/Header";
import { PostsList } from "../../components/PostsList";
import { SearchTextInput } from "../../components/SearchTextInput";
import { RootStackRoutes } from "../../root-stack-routes";
import { assert } from "../../utils/assert";
import { useEdgeSpacing, useTheme } from "../providers/Theming";
import { useNavigation } from "@react-navigation/native";
import { OpenDrawerButton } from "../../components/OpenDrawerButton";

const Stack = createStackNavigator();
type Modes = "search" | "explore";

const Context = createContext<
  | ({
      term: string;
      mode: "search" | "explore";
    } & Required<Pick<TextInputProps, "onChangeText">>)
  | null
>(null);

const SearchContext: React.FunctionComponent = function SearchContext({
  children,
}) {
  const [term, onChangeText] = useState("");
  const [mode, setMode] = useState<Modes>("explore");
  useEffect(() => {
    const text = Boolean(term.trim());
    if (text && mode === "explore") {
      setMode("search");
      return;
    } else if (!text && mode === "search") {
      setMode("explore");
    }
  }, [mode, term]);

  return (
    <Context.Provider
      value={{
        term,
        onChangeText: (text) => onChangeText(text),
        mode,
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
  const { term, mode } = useSearchContext();
  const navigation = useNavigation();
  const { data } = useSearch(term);
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
      {mode === "explore" && (
        // TODO: adds "safe" padding at bottom based on tabbar height
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
      )}
      {mode === "search" && (
        <Frame>
          <PostsList data={data} />
        </Frame>
      )}
    </Frame>
  );
}

function Screen() {
  const { term, onChangeText, mode } = useSearchContext();
  return (
    <Stack.Navigator
      screenOptions={{
        // TODO: animate mode transitions
        header: (props) => {
          return (
            <Header {...props}>
              <Frame
                flexDirection="column"
                style={{
                  width: "100%",
                }}
              >
                {mode === "explore" && (
                  <Frame flexDirection="row">
                    <OpenDrawerButton />
                    <Font variant="display">Explore</Font>
                  </Frame>
                )}
                <Frame
                  marginTop={mode === "explore" ? "medium" : "none"}
                  style={{
                    width: "100%",
                  }}
                >
                  <SearchTextInput value={term} onChangeText={onChangeText} />
                </Frame>
              </Frame>
            </Header>
          );
        },
        animationEnabled: false,
      }}
    >
      <Stack.Screen
        name={RootStackRoutes.Search}
        component={Search}
        options={{
          animationEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

const Root = React.memo(function Root() {
  return (
    <SearchContext>
      <Screen />
    </SearchContext>
  );
});

export { Root as Search };

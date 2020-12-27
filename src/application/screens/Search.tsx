import { createStackNavigator } from "@react-navigation/stack";
import { opacify, textInputs } from "polished";
import React, {
  useState,
  createContext,
  Children,
  useContext,
  useEffect,
} from "react";
import { StyleSheet, View, TextInputProps } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { QueryIds } from "../../api/QueryIds";
import { useSearch } from "../../api/useSearch";
import { useTransaction } from "../../api/useTransaction";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Grid } from "../../components/Grid";
import { Header } from "../../components/Header";
import { PostsList } from "../../components/PostsList";
import { useDebounce } from "../../hooks/use-debounce";
import { useStyles } from "../../hooks/use-styles";
import { RouteNames } from "../../route-names";
import { useEdgeSpacing, useTheme } from "../providers/Theming";
import { SearchTextInput } from "../../components/SearchTextInput";
import { assert } from "../../utils/assert";

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
  const styles = useStyles((theme) => ({
    root: {
      position: "relative",
      zIndex: 1,
      width: "100%",
      justifyContent: "flex-end",
      height: 160,
      borderRadius: theme.constants.borderRadius,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.backgroundAccent,
      backgroundColor: theme.colors.backgroundAccent,
      shadowColor: opacify(0.5, theme.colors.absoluteDark),
      padding: theme.units.medium,
      ...theme.constants.shadow,
    },
    decoration: {
      ...theme.constants.shadow,
      position: "absolute",
      borderRadius: theme.constants.borderRadius,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.backgroundAccent,
      backgroundColor: theme.colors.background,
      bottom: -10,
      width: "100%",
      height: 100,
      zIndex: 0,
    },
  }));
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  const { term, mode } = useSearchContext();
  const { data } = useSearch(term);
  const { data: hashtags } = useTransaction<{ total: string; value: string }>(
    QueryIds.topHashtags,
    "select count(value) as total, value from hashtags group by value order by total desc limit 8"
  );

  return (
    <Frame
      flexDirection="column"
      backgroundColor={theme.colors.background}
      flex={1}
    >
      {mode === "explore" && (
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
              <View
                key={String(item.value + item.total)}
                style={{
                  width: "100%",
                }}
              >
                <View style={styles.root}>
                  <Font variant="display">{item.value}</Font>
                  <Font variant="caption">{item.total} thoughts</Font>
                </View>
                <View
                  style={[
                    styles.decoration,
                    {
                      bottom: -10,
                      transform: [{ scale: 0.92 }],
                    },
                  ]}
                />
                <View
                  style={[
                    styles.decoration,
                    {
                      bottom: -5,
                      transform: [{ scale: 0.96 }],
                    },
                  ]}
                />
              </View>
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
        header: (props) => {
          return (
            <Header {...props}>
              <Frame
                flexDirection="column"
                style={{
                  width: "100%",
                }}
              >
                {mode === "explore" && <Font variant="display">Explore</Font>}
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
        name={RouteNames.Search}
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

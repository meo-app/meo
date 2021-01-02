import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
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
import { RootStackParamList, RootStackRoutes } from "../../root-stack-routes";
import { useSearchContext } from "../providers/SearchProvider";
import { useEdgeSpacing, useTheme } from "../providers/Theming";

function Search() {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  const { term, onChangeText, setIsFocused } = useSearchContext();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
                navigation.navigate(RootStackRoutes.SearchResutls);
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
  const { data, isFetched } = useSearch(term);
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
                  navigation.navigate(RootStackRoutes.Search);
                }
              }}
            />
          </Frame>
          <Pressable
            onPress={() => navigation.navigate(RootStackRoutes.Search)}
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
      {Boolean(data?.length) && (
        <Frame flex={1} backgroundColor={theme.colors.background}>
          <PostsList data={data} />
        </Frame>
      )}
      {!term && Boolean(!data?.length) && (
        <Frame
          justifyContent="center"
          alignItems="center"
          style={{
            flex: 1 / 2,
          }}
        >
          <Font variant="subtitle">Find your stuff</Font>
          <Frame marginTop="small">
            <Font>Thougts, tags, anything</Font>
          </Frame>
        </Frame>
      )}
      {isFetched && !data?.length && Boolean(term) && (
        <Frame
          justifyContent="center"
          alignItems="center"
          style={{
            flex: 1 / 2,
          }}
        >
          <Font variant="subtitle">Ops can't find that</Font>
          <Frame marginTop="small">
            <Font>Try something else maybe?</Font>
          </Frame>
        </Frame>
      )}
    </Frame>
  );
}

export { Search, SearchResults };

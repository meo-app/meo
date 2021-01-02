import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import { useSearch } from "../../api/useSearch";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { PostsList } from "../../components/PostsList";
import { SearchTextInput } from "../../components/SearchTextInput";
import { RootStackRoutes } from "../../root-stack-routes";
import { useSearchContext } from "../providers/SearchProvider";
import { useTheme } from "../providers/Theming";

const SearchResults: React.VoidFunctionComponent = function SearchResults() {
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
                  navigation.navigate(RootStackRoutes.Explore);
                }
              }}
            />
          </Frame>
          <Pressable
            onPress={() => navigation.navigate(RootStackRoutes.Explore)}
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
};

export { SearchResults };
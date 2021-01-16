import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { ListRenderItem, Pressable } from "react-native";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { QueryIds } from "../../api/QueryIds";
import { useTransaction } from "../../api/useTransaction";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { HashtagCard } from "../../components/HashtagCard";
import { Header } from "../../components/Header";
import { OpenDrawerButton } from "../../components/OpenDrawerButton";
import { SearchTextInput } from "../../components/SearchTextInput";
import { RootStackParamList, RootStackRoutes } from "../../root-stack-routes";
import { useSearchContext } from "../providers/SearchProvider";
import { useEdgeSpacing, useTheme } from "../providers/Theming";

function Explore() {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  const { term, onChangeText, setIsFocused } = useSearchContext();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // TODO: entity!
  const { data: hashtags } = useTransaction<{ total: string; value: string }>(
    QueryIds.topHashtags,
    "select count(value) as total, value from hashtags group by value order by total"
  );

  const renderItem = useCallback<
    ListRenderItem<{
      total: string;
      value: string;
    }>
  >(
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
          <TouchableWithoutFeedback
            onPressIn={() => {
              navigation.navigate(RootStackRoutes.SearchResutls);
              setIsFocused(true);
            }}
            style={{
              zIndex: 1,
              marginTop: theme.units.medium,
              width: "100%",
            }}
          >
            <SearchTextInput
              value={term}
              onChangeText={onChangeText}
              editable={false}
              pointerEvents="box-none"
            />
          </TouchableWithoutFeedback>
        </Frame>
      </Header>
      <Frame>
        <FlatList
          columnWrapperStyle={{
            flex: 1,
          }}
          data={hashtags}
          renderItem={renderItem}
          numColumns={2}
        />
      </Frame>
    </Frame>
  );
}

export { Explore };

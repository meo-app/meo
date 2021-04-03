import { useKeyboard } from "@react-native-community/hooks";
import React, { useCallback } from "react";
import { InputAccessoryView, Pressable, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useDebounceValue } from "../hooks/use-debounce-value";
import { useSQLiteQuery } from "../hooks/use-sqlite-query";
import { useTextCaretWord } from "../hooks/use-text-caret-word";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { QueryKeys } from "../shared/QueryKeys";
import { Font } from "./Font";
import { Frame } from "./Frame";

interface QueryResult {
  value: string;
}

function HashtagSelector({
  text,
  caretWord,
  onHashtagSelected,
  nativeID,
}: {
  text: string;
  caretWord: ReturnType<typeof useTextCaretWord>["caretWord"];
  onHashtagSelected: (text: string) => void;
  nativeID: string;
}) {
  const theme = useTheme();
  const { paddingHorizontal } = usePaddingHorizontal();
  const { keyboardHeight } = useKeyboard();
  const { data: result } = useSQLiteQuery<QueryResult>({
    queryKey: [QueryKeys.SEARCH_HASHTAGS, caretWord?.word || null],
    query: `select distinct value from hashtags where value like "%${caretWord?.word}%" collate nocase`,
    options: {
      enabled: Boolean(caretWord?.word && text.trim().length),
    },
  });

  const data = useDebounceValue(caretWord?.word ? result : [], {
    delay: 400,
  });

  const renderItem = useCallback(
    ({ item }: { item: QueryResult }) => (
      <Pressable
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
          paddingVertical: theme.units.small,
          paddingHorizontal: paddingHorizontal,
        })}
        onPress={() => {
          let nextContext = text.split("");
          if (!nextContext.includes(" ")) {
            onHashtagSelected(item.value);
          } else if (caretWord) {
            /**
             * Store the text content from the last letter focused on the caret
             * until the very end of the text
             */
            const end = nextContext.slice(
              caretWord.endIndex + 1,
              nextContext.length
            );

            /** Delete the word from the text */
            nextContext.splice(caretWord.startIndex, nextContext.length);

            /**
             * Merge the new text following the order:
             *
             * - start of text
             * - * ~ new hashtag ~ *
             * - end of text
             */
            nextContext = [...nextContext, ...item.value.split(""), ...end];
            onHashtagSelected(nextContext.join(""));
          }
        }}
      >
        <Font color="primary" variant="strong">
          {item.value}
        </Font>
      </Pressable>
    ),
    [caretWord, onHashtagSelected, paddingHorizontal, text, theme.units.small]
  );

  const keyExtractor = useCallback((item: QueryResult) => item.value, []);

  return (
    <InputAccessoryView
      nativeID={nativeID}
      backgroundColor={theme.colors.backgroundAccent}
    >
      <FlatList
        contentContainerStyle={{
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.colors.backgroundAccent,
        }}
        style={{
          maxHeight: keyboardHeight / 3,
        }}
        keyboardShouldPersistTaps="handled"
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        {...(data?.length && {
          ListHeaderComponent: <Frame style={{ height: theme.units.small }} />,
          ListFooterComponent: <Frame style={{ height: theme.units.small }} />,
        })}
      />
    </InputAccessoryView>
  );
}

export { HashtagSelector };

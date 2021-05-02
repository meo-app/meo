import React from "react";
import { Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDebounceValue } from "../hooks/use-debounce-value";
import { useSQLiteQuery } from "../hooks/use-sqlite-query";
import { useTextCaretWord } from "../hooks/use-text-caret-word";
import { usePaddingHorizontal } from "../providers/Theming/hooks/use-padding-horizontal";
import { useTheme } from "../providers/Theming/hooks/use-theme";
import { QueryKeys } from "../shared/QueryKeys";
import { Font } from "./Font";

interface QueryResult {
  value: string;
}

function HashtagSelector({
  text,
  caretWord,
  onHashtagSelected,
}: {
  text: string;
  caretWord: ReturnType<typeof useTextCaretWord>["caretWord"];
  onHashtagSelected: (text: string) => void;
}) {
  const theme = useTheme();
  const { paddingHorizontal } = usePaddingHorizontal();
  const { data: result } = useSQLiteQuery<QueryResult>({
    queryKey: [QueryKeys.SEARCH_HASHTAGS, caretWord?.word || null],
    query: `select distinct value from hashtags where value like "%${caretWord?.word}%" collate nocase limit 5`,
    options: {
      enabled: Boolean(caretWord?.word && text.trim().length),
    },
  });

  const data = useDebounceValue(caretWord?.word ? result : [], {
    delay: 400,
  });

  return (
    <ScrollView
      horizontal
      directionalLockEnabled
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        minHeight: theme.scales.larger,
        alignItems: "center",
        width: "100%",
        flex: 1,
      }}
    >
      {data?.map((item) => (
        <Pressable
          key={item.value}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            paddingVertical: theme.units.medium,
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
      ))}
    </ScrollView>
  );
}

export { HashtagSelector };

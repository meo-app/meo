import { useKeyboard } from "@react-native-community/hooks";
import {
  EventListenerCallback,
  EventMapCore,
  NavigationProp,
  NavigationState,
  useNavigation,
} from "@react-navigation/native";
import { rgba } from "polished";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TextInputSelectionChangeEventData,
  useWindowDimensions,
} from "react-native";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { Icon } from "../components/Icon/Icon";
import { PostTextContent } from "../components/PostTextContent";
import { UserAvatar } from "../components/UserAvatar";
import { useCreatePost } from "../hooks/use-create-post";
import { useSQLiteQuery } from "../hooks/use-sqlite-query";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { getTextCaretWord } from "../shared/hashtag-utils";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";
import { QueryKeys } from "../shared/QueryKeys";

function Create() {
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const { coordinates, keyboardShown } = useKeyboard();
  const { paddingHorizontal } = usePaddingHorizontal();
  const backgroundColor = theme.colors.background;
  const [selection, setSelection] = useState<
    TextInputSelectionChangeEventData["selection"]
  >({
    end: 0,
    start: 0,
  });

  const [caretWord, setCaretWord] = useState<ReturnType<
    typeof getTextCaretWord
  > | null>(null);
  const [text, onChangeText] = useState("");
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        spacer: {
          height: insets.top,
          width: "100%",
          backgroundColor: rgba(255, 255, 255, 0),
        },
        root: {
          paddingHorizontal,
          paddingTop: theme.units.large,
          paddingBottom: theme.units.small,
          borderBottomColor: theme.colors.backgroundAccent,
        },
      }),
    [
      insets.top,
      paddingHorizontal,
      theme.colors.backgroundAccent,
      theme.units.large,
      theme.units.small,
    ]
  );
  const navigation = useNavigation<NavigationProp<NavigationParamsConfig>>();
  const { mutate: createPost } = useCreatePost({
    onSuccess: () =>
      navigation.navigate("Home", {
        resetScroll: true,
      }),
  });

  useEffect(() => {
    const listener: EventListenerCallback<
      EventMapCore<NavigationState<NavigationParamsConfig>>,
      "beforeRemove"
    > = () => {
      if (text) {
        createPost({ text });
      }
    };

    navigation.addListener("beforeRemove", listener);
    return () => navigation.removeListener("beforeRemove", listener);
  }, [createPost, navigation, text]);

  const { data } = useSQLiteQuery<{
    value: string;
  }>({
    queryKey: [QueryKeys.SEARCH_HASHTAGS, caretWord],
    query: `select distinct value from hashtags where value like "%${caretWord?.word}%" collate nocase`,
    options: {
      enabled: Boolean(caretWord),
    },
  });

  useEffect(() => {
    setCaretWord(getTextCaretWord({ text, selection }));
  }, [selection, text]);

  return (
    <>
      <Frame style={styles.root}>
        <Frame style={styles.spacer} />
        <Frame
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => ({
              zIndex: 1,
              marginRight: theme.units.medium,
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Icon type="Back" size="medium" />
          </Pressable>
        </Frame>
      </Frame>
      <Frame flex={1} style={{ flex: 1, backgroundColor }}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingTop: theme.units.medium,
          }}
        >
          <Frame
            paddingHorizontal={paddingHorizontal}
            flex={1}
            justifyContent="flex-end"
            alignItems="flex-start"
            style={{
              backgroundColor: theme.colors.background,
            }}
          >
            <Frame
              flexDirection="row"
              alignItems="center"
              justifyContent="space-around"
              flex={1}
              style={{ width: "100%" }}
            >
              <Frame
                alignItems="flex-end"
                marginTop="small"
                alignSelf="flex-start"
              >
                <UserAvatar size="larger" />
              </Frame>
              <TextInput
                autoFocus
                placeholder="Write something"
                placeholderTextColor={theme.colors.foregroundSecondary}
                onChangeText={onChangeText}
                multiline
                onSelectionChange={({ nativeEvent: { selection } }) =>
                  setSelection(selection)
                }
                style={{
                  ...(theme.typography.highlight as Object),
                  width: "80%",
                  marginTop: theme.units.small,
                  paddingBottom: theme.units.medium,
                  paddingLeft: theme.units.small,
                }}
              >
                <PostTextContent value={text} variant="highlight" />
              </TextInput>
            </Frame>
          </Frame>
          <Frame
            style={{
              height: height / 1.5,
            }}
          />
        </ScrollView>
        <KeyboardAvoidingView
          style={{
            display:
              text && data?.length && caretWord !== null && keyboardShown
                ? "flex"
                : "none",
          }}
        >
          <Frame
            style={{
              position: "absolute",
              width: "100%",
              height: 150,
              flex: 1,
              bottom: coordinates.end.height,
              backgroundColor: theme.colors.backgroundAccent,
            }}
          >
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                    paddingVertical: theme.units.small,
                    paddingHorizontal: paddingHorizontal,
                  })}
                  onPress={() => {
                    let nextContext = text.split("");
                    if (caretWord) {
                      /**
                       * Store the text content from the last letter focused on the caret
                       * until the very end of the text
                       */
                      const end = nextContext.slice(
                        caretWord.endIndex + 1,
                        nextContext.length
                      );

                      /** Delete the word from the text */
                      nextContext.splice(
                        caretWord.startIndex,
                        nextContext.length
                      );

                      /**
                       * Merge the new text following the order:
                       *
                       * - start of text
                       * - * ~ new hashtag ~ *
                       * - end of text
                       */
                      nextContext = [
                        ...nextContext,
                        ...item.value.split(""),
                        ...end,
                      ];
                    }

                    onChangeText(nextContext.join(""));
                    setCaretWord(null);
                  }}
                >
                  <Font key={item.value} color="primary">
                    {item.value}
                  </Font>
                </Pressable>
              )}
            />
          </Frame>
        </KeyboardAvoidingView>
      </Frame>
    </>
  );
}

export { Create };

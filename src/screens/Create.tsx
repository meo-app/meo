import {
  EventListenerCallback,
  EventMapCore,
  NavigationProp,
  NavigationState,
  useNavigation,
} from "@react-navigation/native";
import { rgba } from "polished";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Frame } from "../components/Frame";
import { HashtagSelector } from "../components/HashtagSelector";
import { Icon } from "../components/Icon/Icon";
import { PostTextContent } from "../components/PostTextContent";
import { UserAvatar } from "../components/UserAvatar";
import { useCreatePost } from "../hooks/use-create-post";
import { useTextCaretWord } from "../hooks/use-text-caret-word";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";

const TEXT_INPUT_NATIVE_ID = "create-post-input";

function Create() {
  const theme = useTheme();
  const backgroundColor = theme.colors.background;
  const { height } = useWindowDimensions();
  const { paddingHorizontal } = usePaddingHorizontal();
  const ref = useRef<TextInput | null>(null);
  const [text, changeText] = useState("");
  const { caretWord, onSelectionChange } = useTextCaretWord({
    text,
  });
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        spacer: {
          paddingTop: insets.top,
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
                ref={ref}
                autoFocus
                placeholder="Write something"
                placeholderTextColor={theme.colors.foregroundSecondary}
                onChangeText={(text) => changeText(text)}
                multiline
                inputAccessoryViewID={TEXT_INPUT_NATIVE_ID}
                onSelectionChange={onSelectionChange}
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
        <HashtagSelector
          text={text}
          caretWord={caretWord}
          onHashtagSelected={(text) => changeText(text)}
          nativeID={TEXT_INPUT_NATIVE_ID}
        />
      </Frame>
    </>
  );
}

export { Create };

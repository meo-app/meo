import {
  EventListenerCallback,
  EventMapCore,
  NavigationProp,
  NavigationState,
  useNavigation,
} from "@react-navigation/native";
import { rgba } from "polished";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, NativeMethods, Pressable, StyleSheet } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { Icon } from "../components/Icon/Icon";
import { PostInputAccessory } from "../components/PostInputAccessory";
import { PostTextContent } from "../components/PostTextContent";
import { UserAvatar } from "../components/UserAvatar";
import { useCreatePost } from "../hooks/use-create-post";
import { useTextCaretWord } from "../hooks/use-text-caret-word";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";

function Create() {
  const theme = useTheme();
  const { paddingHorizontal } = usePaddingHorizontal();
  const ref = useRef<(TextInput & NativeMethods) | null>(null);
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
        header: {
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
    > = (event) => {
      if (!text) {
        return;
      }

      event.preventDefault();
      Alert.alert(
        "Discard changes?",
        "You have unsaved changes. Are you sure to leave?",
        [
          { text: "Don't leave", style: "cancel", onPress: () => {} },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.dispatch(event.data.action),
          },
        ]
      );
    };

    navigation.addListener("beforeRemove", listener);
    return () => navigation.removeListener("beforeRemove", listener);
  }, [createPost, navigation, text]);

  /**
   * autoFocus on TextInput would do the job, BUT for some reason
   * it bugs `KeyboardAvoidingView` used on PostInputAccessory component
   *
   * Focusing manually seems to have fixed the problem, RN4LIFE
   */
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <Frame flex={1}>
      <Frame style={styles.header}>
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <Frame
          paddingHorizontal={paddingHorizontal}
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
              placeholder="Write something"
              placeholderTextColor={theme.colors.foregroundSecondary}
              onChangeText={(text) => changeText(text)}
              multiline
              onSelectionChange={onSelectionChange}
              style={{
                ...(theme.typography.highlight as Object),
                flex: 1,
                width: "80%",
                height: "100%",
                textAlignVertical: "top",
                marginTop: theme.units.larger,
                paddingBottom: theme.units.medium,
                paddingLeft: theme.units.medium,
              }}
            >
              <PostTextContent value={text} variant="highlight" />
            </TextInput>
          </Frame>
        </Frame>
      </ScrollView>
      <PostInputAccessory
        text={text}
        caretWord={caretWord}
        onHashtagSelected={(text) => changeText(text)}
      >
        <Pressable
          onPress={() => {
            if (text) {
              createPost({ text });
            }
          }}
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: theme.constants.absoluteRadius,
            paddingVertical: theme.units.small,
            paddingHorizontal,
          }}
        >
          <Font variant="strong" color="absoluteLight">
            Post
          </Font>
        </Pressable>
      </PostInputAccessory>
    </Frame>
  );
}

export { Create };

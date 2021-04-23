import {
  EventListenerCallback,
  EventMapCore,
  NavigationProp,
  NavigationState,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { rgba } from "polished";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  NativeMethods,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
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
  const params = useRoute<RouteProp<NavigationParamsConfig, "Create">>().params;
  const ref = useRef<(TextInput & NativeMethods) | null>(null);
  const [text, changeText] = useState(params?.initialTextContent || "");
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { caretWord, onSelectionChange } = useTextCaretWord({
    text,
  });

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
    onSuccess: () => {
      navigation.navigate(params?.onPostCreateRoute || "Home", {
        resetScroll: true,
      });
    },
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
      <Frame
        flex={1}
        paddingHorizontal={paddingHorizontal}
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="space-around"
      >
        <Frame
          alignItems="flex-end"
          marginTop="small"
          alignSelf="flex-start"
          width="larger"
        >
          <UserAvatar size="larger" />
        </Frame>
        <Frame paddingLeft="medium">
          <TextInput
            ref={ref}
            placeholder="Write something"
            placeholderTextColor={theme.colors.foregroundSecondary}
            onChangeText={(text) => changeText(text)}
            multiline
            onSelectionChange={onSelectionChange}
            scrollEnabled
            style={{
              ...(theme.typography.highlight as Object),
              flex: 1,
              textAlignVertical: "top",
              paddingBottom: theme.units.medium,
              paddingLeft: theme.units.medium,
              width: dimensions.width * 0.7,
            }}
          >
            <PostTextContent value={text} variant="highlight" />
          </TextInput>
        </Frame>
      </Frame>
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

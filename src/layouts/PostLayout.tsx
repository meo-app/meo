import React, { useState } from "react";
import { NativeMethods, Pressable } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useTextCaretWord } from "../hooks/use-text-caret-word";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { NavigationHeader } from "../components/NavigationHeader";
import { PostInputAccessory } from "../components/PostInputAccessory";
import { PostTextContent } from "../components/PostTextContent";

interface Props {
  text: string;
  changeText: (text: string) => void;
  onCreatePostPress?: () => void;
  children?: React.ReactNode;
  navigationHeaderChildren?: React.ReactNode;
  beforeTextContent?: React.ReactNode;
}

const PostLayout = React.forwardRef<TextInput & NativeMethods, Props>(
  function PostLayout(
    { changeText, text, children, onCreatePostPress, beforeTextContent },
    ref: React.Ref<TextInput & NativeMethods>
  ) {
    const theme = useTheme();
    const { paddingHorizontal } = usePaddingHorizontal();
    const { caretWord, onSelectionChange } = useTextCaretWord({
      text,
    });

    return (
      <>
        <NavigationHeader icon="Back" />
        {beforeTextContent}
        <Frame
          flex={1}
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="flex-start"
          marginTop="medium"
          paddingHorizontal={paddingHorizontal}
        >
          {children}
          <Frame flexGrow={1} flexShrink={1}>
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
                textAlign: "left",
                marginTop: theme.units.small,
                paddingBottom: theme.units.medium,
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
          {onCreatePostPress && (
            <Pressable
              onPress={onCreatePostPress}
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
          )}
        </PostInputAccessory>
      </>
    );
  }
);

export { PostLayout };

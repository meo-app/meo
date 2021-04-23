import React from "react";
import { NativeMethods, Pressable, useWindowDimensions } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useTextCaretWord } from "../hooks/use-text-caret-word";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { PostInputAccessory } from "./PostInputAccessory";
import { PostTextContent } from "./PostTextContent";

interface Props {
  text: string;
  changeText: (text: string) => void;
  onPostButtonPress?: () => void;
  textInputWidth?: number | string;
}

const PostInputLayout = React.forwardRef<TextInput & NativeMethods, Props>(
  React.memo<Props>(function PostInputLayout(
    { changeText, text, children, onPostButtonPress, textInputWidth },
    ref: React.MutableRefObject<TextInput & NativeMethods>
  ) {
    const theme = useTheme();
    const dimensions = useWindowDimensions();
    const { paddingHorizontal } = usePaddingHorizontal();
    const { caretWord, onSelectionChange } = useTextCaretWord({
      text,
    });
    return (
      <>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <Frame
            flex={1}
            paddingHorizontal={paddingHorizontal}
            flexDirection="row"
            alignItems="flex-start"
            justifyContent="space-around"
          >
            <Frame paddingLeft="medium">
              {children}
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
                  marginTop: theme.units.medium,
                  paddingBottom: theme.units.medium,
                  paddingLeft: theme.units.medium,
                  width: textInputWidth || dimensions.width * 0.7,
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
          {onPostButtonPress && (
            <Pressable
              onPress={() => {
                // if (text) {
                //   createPost({ text });
                // }
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
          )}
        </PostInputAccessory>
      </>
    );
  })
);

export { PostInputLayout };

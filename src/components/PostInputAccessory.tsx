import React from "react";
import { KeyboardAvoidingView } from "react-native";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { Frame } from "./Frame";
import { HashtagSelector } from "./HashtagSelector";

interface Props extends React.ComponentProps<typeof HashtagSelector> {
  children?: React.ReactNode;
  hideHashtags?: boolean;
}

const PostInputAccessory = React.memo<Props>(function PostInputAccessory({
  text,
  caretWord,
  onHashtagSelected,
  children,
  hideHashtags,
}) {
  const theme = useTheme();
  const { paddingHorizontal } = usePaddingHorizontal();
  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled
      keyboardVerticalOffset={0}
      style={{
        flex: 1 / 5,
        height: 100,
        width: "100%",
        paddingBottom: theme.units.large,
        paddingRight: paddingHorizontal,
      }}
    >
      <Frame
        justifyContent="space-between"
        flexDirection="row"
        alignItems="center"
      >
        <Frame flex={1}>
          {!hideHashtags && (
            <HashtagSelector
              text={text}
              caretWord={caretWord}
              onHashtagSelected={onHashtagSelected}
            />
          )}
        </Frame>
        <Frame justifyContent="flex-end">{children}</Frame>
      </Frame>
    </KeyboardAvoidingView>
  );
});

export { PostInputAccessory };

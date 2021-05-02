import React from "react";
import { KeyboardAvoidingView } from "react-native";
import { useTheme } from "../providers/Theming/hooks/use-theme";
import { Frame } from "./Frame";
import { HashtagSelector } from "./HashtagSelector";

interface Props extends React.ComponentProps<typeof HashtagSelector> {
  children?: React.ReactNode;
}

const PostInputAccessory = React.memo<Props>(function PostInputAccessory({
  text,
  caretWord,
  onHashtagSelected,
  children,
}) {
  const theme = useTheme();
  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        keyboardVerticalOffset={0}
        style={{
          flex: 1 / 5,
          minHeight: theme.units.largest,
          width: "100%",
          paddingBottom: theme.units.large,
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Frame
          justifyContent="space-between"
          flexDirection="row"
          alignItems="center"
        >
          <Frame flex={1}>
            <HashtagSelector
              text={text}
              caretWord={caretWord}
              onHashtagSelected={onHashtagSelected}
            />
          </Frame>
          <Frame justifyContent="flex-end">{children}</Frame>
        </Frame>
      </KeyboardAvoidingView>
    </>
  );
});

export { PostInputAccessory };

import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAvoidingView } from "react-native";
import { useTheme } from "../providers/Theming/Theming";
import { Frame } from "./Frame";
import { HashtagSelector } from "./HashtagSelector";
import { transparentize } from "polished";

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
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.8 }}
        colors={[
          transparentize(1, theme.colors.background),
          theme.colors.background,
        ]}
        style={{
          height: theme.scales.smaller,
          width: "100%",
          top: -theme.scales.smaller,
        }}
      />
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        keyboardVerticalOffset={0}
        style={{
          flex: 1 / 5,
          height: 100,
          width: "100%",
          paddingBottom: theme.units.large,
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

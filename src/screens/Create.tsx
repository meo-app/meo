import {
  EventListenerCallback,
  EventMapCore,
  NavigationProp,
  NavigationState,
  useNavigation,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Pressable } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon/Icon";
import { PostTextContent } from "../components/PostTextContent";
import { UserAvatar } from "../components/UserAvatar";
import { useCreatePost } from "../hooks/use-create-post";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";

function Create() {
  const theme = useTheme();
  const { paddingHorizontal } = usePaddingHorizontal();
  const backgroundColor = theme.colors.background;
  const [text, onChangeText] = useState("");
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
  }, [navigation, text]);

  return (
    <>
      <Header hideBackground>
        <Frame
          flexDirection="row"
          justifyContent="space-between"
          flex={1}
          alignItems="center"
        >
          <Frame
            style={{
              marginLeft: -theme.units.medium,
              marginBottom: -theme.units.medium,
            }}
          >
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                display: "flex",
                width: "100%",
                paddingBottom: theme.units.medium,
                paddingLeft: theme.units.medium,
                paddingRight: theme.units.large,
              }}
            >
              <Icon type="Close" size="medium" />
            </Pressable>
          </Frame>
          <Frame marginTop="large">
            <Pressable
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
              onPress={() => createPost({ text })}
              disabled={!text}
            >
              <Font color="primary">Create</Font>
            </Pressable>
          </Frame>
        </Frame>
      </Header>
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
                // TODO: select hashtags available on the app
                // onSelectionChange={(event) => {
                //   console.log(text[event.nativeEvent.selection.start]);
                // }}
                onChangeText={onChangeText}
                multiline
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
        </ScrollView>
      </Frame>
    </>
  );
}

export { Create };

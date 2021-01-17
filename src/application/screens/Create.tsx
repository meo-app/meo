import {
  EventListenerCallback,
  EventMapCore,
  NavigationState,
  useNavigation,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useCreatePost } from "../../api/useCreatePost";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon/Icon";
import { PostTextContent } from "../../components/PostTextContent";
import { UserAvatar } from "../../components/UserAvatar";
import { RootStackRoutes } from "../../root-stack-routes";
import { useEdgeSpacing, useTheme } from "../providers/Theming";

const Stack = createStackNavigator();

const Context = React.createContext<{
  text: string;
  createPost: ReturnType<typeof useCreatePost>["mutate"];
  onChangeText: (text: string) => void;
} | null>(null);

const CreateProvider: React.FunctionComponent = ({ children }) => {
  const [text, onChangeText] = useState("");
  const navigation = useNavigation();
  const { mutate: createPost } = useCreatePost({
    onSuccess: () => navigation.navigate(RootStackRoutes.Home),
  });

  useEffect(() => {
    const listener: EventListenerCallback<
      EventMapCore<NavigationState>,
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
    <Context.Provider
      value={{
        text,
        onChangeText,
        createPost,
      }}
    >
      {children}
    </Context.Provider>
  );
};

function useCreateContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("CreateContext not found");
  }

  return context;
}

function Create() {
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const { onChangeText, text } = useCreateContext();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <View
          style={{
            flex: 1,
            paddingLeft: theme.units[spacing.horizontal],
            paddingRight: theme.units[spacing.horizontal],
            backgroundColor: theme.colors.background,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
          }}
        >
          <Frame
            flexDirection="row"
            alignItems="center"
            flex={1}
            style={{
              width: "100%",
            }}
          >
            <Frame
              height="largest"
              alignItems="flex-end"
              marginTop="small"
              style={{
                alignSelf: "flex-start",
              }}
            >
              <UserAvatar />
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
                ...(theme.typography.body as Object),
                width: "80%",
                marginTop: theme.units.small,
                paddingBottom: theme.units.medium,
                paddingLeft: theme.units.small,
              }}
            >
              <PostTextContent value={text} />
            </TextInput>
          </Frame>
        </View>
      </ScrollView>
    </View>
  );
}

function Screens() {
  const theme = useTheme();
  const { createPost, text } = useCreateContext();
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => (
          <Header {...props} hideBackground>
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
                  onPress={() => props.navigation.goBack()}
                  style={{
                    display: "flex",
                    width: "100%",
                    paddingTop: theme.units.medium,
                    paddingBottom: theme.units.medium,
                    paddingLeft: theme.units.medium,
                    paddingRight: theme.units.large,
                  }}
                >
                  <Icon type="Close" size="small" />
                </Pressable>
              </Frame>
              <Frame marginTop="large">
                <Pressable
                  disabled={!text}
                  onPress={() => {
                    createPost({ text });
                  }}
                  style={({ pressed }) => ({
                    backgroundColor: !text
                      ? theme.colors.foregroundSecondary
                      : theme.colors.primary,
                    opacity: pressed ? 0.5 : 1,
                    paddingTop: theme.units.smaller,
                    paddingBottom: theme.units.smaller,
                    paddingLeft: theme.units.small,
                    paddingRight: theme.units.small,
                    borderRadius: theme.constants.absoluteRadius,
                    alignItems: "center",
                    ...(theme.typography.caption as Object),
                  })}
                >
                  <Font color="absoluteLight">Create</Font>
                </Pressable>
              </Frame>
            </Frame>
          </Header>
        ),
      }}
    >
      <Stack.Screen name={RootStackRoutes.Create} component={Create} />
    </Stack.Navigator>
  );
}

function Root() {
  return (
    <CreateProvider>
      <Screens />
    </CreateProvider>
  );
}

export { Root as Create };

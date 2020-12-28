import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useState } from "react";
import { Pressable, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useCreatePost } from "../../api/useCreatePost";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon/Icon";
import { Picture } from "../../components/Picture";
import { PostTextContent } from "../../components/PostTextContent";
import { RootStackRoutes } from "../../root-stack-routes";
import { useEdgeSpacing, useTheme } from "../providers/Theming";

const Stack = createStackNavigator();

const Context = React.createContext<{
  text: string;
  createPost: ReturnType<typeof useCreatePost>["mutate"];
  onChangeText: (text: string) => void;
} | null>(null);

const CreateProvider: React.FunctionComponent = ({ children }) => {
  const [text, setText] = useState("");
  const navigation = useNavigation();
  const { mutate: createPost } = useCreatePost({
    onSuccess: () => navigation.navigate(RootStackRoutes.Home),
  });

  return (
    <Context.Provider
      value={{
        text,
        onChangeText: setText,
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
  const navigation = useNavigation();

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
            paddingTop={spacing.horizontal}
            flex={1}
            style={{
              width: "100%",
            }}
          >
            <Frame height="largest" alignItems="flex-end">
              <Picture
                style={{
                  borderRadius: theme.constants.absoluteRadius,
                }}
                width={theme.scales.larger}
                aspectRatio="square"
                resizeMode="cover"
                source="https://i.pravatar.cc/150"
                lazyload={false}
              />
            </Frame>
            <TextInput
              autoFocus
              placeholder="Write something"
              placeholderTextColor={theme.colors.foregroundPrimary}
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
          <Frame justifyContent="flex-end" flex={1} flexDirection="row">
            <Pressable
              onPress={() => {
                navigation.navigate(RootStackRoutes.Settings);
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                width: "100%",
              })}
            >
              <Font
                color="primary"
                variant="caption"
                style={{
                  textAlign: "right",
                }}
              >
                Settings
              </Font>
            </Pressable>
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
          <Header
            {...props}
            hideBackground
            insets={{
              ...props.insets,
              top: props.insets.top - theme.units.medium,
              left: props.insets.left - theme.units.medium,
              bottom: props.insets.bottom - theme.units.medium,
            }}
          >
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

import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import { KeyboardAvoidingView, Pressable } from "react-native";
import {
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
} from "react-native-gesture-handler";
import { useCreatePost } from "../../api/useCreatePost";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon/Icon";
import { Picture } from "../../components/Picture";
import { RouteNames } from "../../route-names";
import { useEdgeSpacing, useTheme } from "../providers/Theming";
import { useFlushOnboarding } from "../../api/onboarding";

const Stack = createStackNavigator();

function Create() {
  const navigation = useNavigation();
  const [text, setTextValue] = useState("");
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const { status, mutate: createPost } = useCreatePost({
    onSuccess: () => navigation.navigate(RouteNames.Home),
  });

  const { mutate: flush } = useFlushOnboarding();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          paddingLeft: theme.units[spacing.horizontal],
          paddingRight: theme.units[spacing.horizontal],
          backgroundColor: theme.colors.background,
        }}
      >
        <Frame
          flexDirection="row"
          alignItems="center"
          paddingTop={spacing.horizontal}
        >
          <Frame height="largest">
            <Picture
              style={{
                borderRadius: theme.constants.borderRadius,
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
            value={text}
            onChangeText={(value) => setTextValue(value)}
            multiline
            numberOfLines={10}
            style={{
              ...(theme.typography.body as Object),
              width: "80%",
              maxHeight: 80,
              paddingBottom: theme.units.medium,
              paddingLeft: theme.units.small,
            }}
          />
        </Frame>
        <Frame />
        <Frame marginTop="large">
          <Pressable
            style={{
              backgroundColor: theme.colors.primary,
              padding: theme.units.medium,
              borderRadius: theme.constants.absoluteRadius,
              alignItems: "center",
              ...(theme.typography.body as Object),
            }}
            disabled={!text || status === "loading"}
            onPress={() =>
              createPost({
                text,
              })
            }
          >
            <Font color="absoluteLight">Create</Font>
          </Pressable>
        </Frame>
        <Pressable
          style={{
            marginTop: theme.units.large,
          }}
        >
          <Font variant="caption" onPress={() => flush()}>
            Flush onboarding status
          </Font>
        </Pressable>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

function Root() {
  const theme = useTheme();
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
          </Header>
        ),
      }}
    >
      <Stack.Screen name={RouteNames.Create} component={Create} />
    </Stack.Navigator>
  );
}

export { Root as Create };

import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, View } from "react-native";
import {
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { useCreatePost } from "../../api/useCreatePost";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon/Icon";
import { RouteNames } from "../../route-names";
import { useEdgeSpacing, useTheme } from "../providers/Theming";
import { Picture } from "../../components/Picture";

const Stack = createStackNavigator();

function Create() {
  const navigation = useNavigation();
  const [text, setTextValue] = useState("");
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const [createPost, { status }] = useCreatePost({
    onSuccess: () => navigation.navigate(RouteNames.Home),
  });

  return (
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
        <Frame width="largest" height="largest">
          <Picture
            style={{
              borderRadius: theme.constants.borderRadius,
            }}
            width={theme.scales.larger}
            aspectRatio="square"
            resizeMode="cover"
            source="https://i.pravatar.cc/150"
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
            padding: theme.units.medium,
          }}
        />
      </Frame>
      <Frame />
      <Frame marginTop="medium">
        <TouchableHighlight
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
        </TouchableHighlight>
      </Frame>
    </KeyboardAvoidingView>
  );
}

function Root() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => (
          <Header {...props}>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-start",
              }}
            >
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <Icon type="Close" size="small" />
              </TouchableOpacity>
            </View>
          </Header>
        ),
      }}
    >
      <Stack.Screen name={RouteNames.Create} component={Create} />
    </Stack.Navigator>
  );
}

export { Root as Create };

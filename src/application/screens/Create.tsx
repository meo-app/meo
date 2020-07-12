import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView } from "react-native";
import { TextInput, TouchableHighlight } from "react-native-gesture-handler";
import { useCreatePost } from "../../api/useCreatePost";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { RouteNames } from "../../route-names";
import { useEdgeSpacing, useTheme } from "../providers/Theming";

function Create() {
  const navigation = useNavigation();
  const [text, setTextValue] = useState("");
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const [createPost, { status }] = useCreatePost({
    onSuccess: () => {
      navigation.navigate(RouteNames.Home);
    },
  });

  return (
    <KeyboardAvoidingView
      style={{
        paddingLeft: theme.units[spacing.horizontal],
        paddingRight: theme.units[spacing.horizontal],
      }}
    >
      <Frame flexDirection="row" alignItems="center">
        <Frame width="largest" height="largest">
          <Image
            style={{
              width: theme.scales.largest,
              height: theme.scales.largest,
              resizeMode: "cover",
              borderRadius: theme.constants.borderRadius,
            }}
            source={{
              uri: "https://i.pravatar.cc/150",
            }}
          />
        </Frame>
        <TextInput
          autoFocus
          placeholder="Write something"
          value={text}
          onChangeText={(value) => setTextValue(value)}
          multiline
          numberOfLines={10}
          style={{
            ...(theme.typography.body as Object),
            width: "80%",
            padding: theme.units.medium,
          }}
        />
      </Frame>
      <Frame marginTop="medium" debugTrace>
        <TouchableHighlight
          disabled={!text || status === "loading"}
          onPress={() =>
            createPost({
              text,
            })
          }
        >
          <Font>Create</Font>
        </TouchableHighlight>
      </Frame>
    </KeyboardAvoidingView>
  );
}

export { Create };

import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Button, KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useCreatePost } from "../../api/useCreatePost";
import { Frame } from "../../components/Frame";
import { useTheme } from "../providers/Theming";

function Create() {
  const navigation = useNavigation();
  const [text, setTextValue] = useState("");
  const theme = useTheme();
  const [createPost, { status }] = useCreatePost({
    onSuccess: () => {
      navigation.navigate("Home"); // TODO: Create enum with possible screens
    },
  });

  return (
    <KeyboardAvoidingView
      style={{
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        placeholder="Write something"
        value={text}
        onChangeText={(value) => setTextValue(value)}
        multiline
        numberOfLines={10}
        style={{
          ...(theme.typography.body as Object),
          width: "100%",
          padding: theme.units.medium,
        }}
      />
      <Frame marginTop="medium">
        <Button
          title="Create"
          disabled={!text || status === "loading"}
          onPress={() =>
            createPost({
              text,
            })
          }
        />
      </Frame>
    </KeyboardAvoidingView>
  );
}

export { Create };

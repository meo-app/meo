import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import {
  AvatarSelection,
  AvatarSelectionProvider,
  useAvatarContext,
} from "../components/AvatarSelection";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { NavigationHeader } from "../components/NavigationHeader";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";

const ChangeAvatar = React.memo(function ChangeAvatar() {
  const { saveAvatar } = useAvatarContext();
  return (
    <>
      <NavigationHeader icon="Close">
        <Frame alignItems="flex-end">
          <Pressable>
            <Font
              variant="body"
              color="primary"
              onPress={() => {
                saveAvatar();
              }}
            >
              Save
            </Font>
          </Pressable>
        </Frame>
      </NavigationHeader>
      <AvatarSelection />
    </>
  );
});

const Root = React.memo(function RootChangeAvatar() {
  const navigation = useNavigation<NavigationProp<NavigationParamsConfig>>();
  return (
    <AvatarSelectionProvider onSuccess={() => navigation.navigate("Home")}>
      <ChangeAvatar />
    </AvatarSelectionProvider>
  );
});

export { Root as ChangeAvatar };

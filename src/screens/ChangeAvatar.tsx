import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import { AvatarSelection } from "../components/AvatarSelection/AvatarSelection";
import { AvatarSelectionProvider } from "../components/AvatarSelection/components/AvatarSelectionProvider";
import { useAvatarSelectionContext } from "../components/AvatarSelection/hooks/use-avatar-selection-context";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { NavigationHeader } from "../components/NavigationHeader";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";

const ChangeAvatar = React.memo(function ChangeAvatar() {
  const { saveAvatar } = useAvatarSelectionContext();
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

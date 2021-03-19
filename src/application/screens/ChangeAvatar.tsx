import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import {
  AvatarSelection,
  AvatarSelectionProvider,
  useAvatarContext,
} from "../../components/AvatarSelection";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { SubtitleHeader } from "../../components/SubtitleHeader";
import { RootStackRoutes } from "../../root-stack-routes";

const ChangeAvatar = React.memo(function ChangeAvatar() {
  const { saveAvatar } = useAvatarContext();
  return (
    <>
      <SubtitleHeader icon="Close">
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
      </SubtitleHeader>
      <AvatarSelection />
    </>
  );
});

const Root = React.memo(function RootChangeAvatar() {
  const navigation = useNavigation();
  return (
    <AvatarSelectionProvider
      onSuccess={() => navigation.navigate(RootStackRoutes.Home)}
    >
      <ChangeAvatar />
    </AvatarSelectionProvider>
  );
});

export { Root as ChangeAvatar };

import { NavigationProp, useNavigation } from "@react-navigation/native";
import { transparentize } from "polished";
import React from "react";
import { Alert, Linking, Modal, ScrollView } from "react-native";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { NavigationHeader } from "../../components/NavigationHeader";
import { useFlushDatabase } from "../../hooks/use-flush-database";
import { useTheme } from "../../providers/Theming/hooks/use-theme";
import { NavigationParamsConfig } from "../../shared/NavigationParamsConfig";
import { useFlushOnboarding } from "../../storage/onboarding";
import { SettingsDataSection } from "./components/SettingsDataSection";
import { SettingsSection } from "./components/SettingsSection";
import { SettingsThemingSection } from "./components/SettingsThemingSection";
import { useCreatDummyPosts } from "./hooks/use-create-dummy-posts";
import { useIsDeveloper } from "./hooks/use-is-developer";

function Settings() {
  const theme = useTheme();
  const { navigate } = useNavigation<NavigationProp<NavigationParamsConfig>>();
  const { isDeveloper } = useIsDeveloper();
  const {
    mutate: flushOnboarding,
    isLoading: isFlusingOboarding,
  } = useFlushOnboarding();
  const {
    mutate: flushDatabase,
    isLoading: isFlusingDatabase,
  } = useFlushDatabase();
  const {
    mutate: createDummyPosts,
    isLoading: isCreatingDummyPosts,
  } = useCreatDummyPosts();

  return (
    <Frame flex={1} backgroundColor="background">
      <Modal
        animationType="slide"
        transparent={true}
        visible={
          isFlusingDatabase || isCreatingDummyPosts || isFlusingOboarding
        }
      >
        <Frame
          flex={1}
          alignItems="center"
          justifyContent="center"
          style={{
            backgroundColor: transparentize(
              0.09,
              theme.colors.backgroundAccent
            ),
          }}
        >
          <Font>Loading...</Font>
        </Frame>
      </Modal>
      <NavigationHeader title="Settings" />
      <Frame flex={1} backgroundColor="backgroundAccent">
        <ScrollView>
          <SettingsSection
            title="Options"
            actions={[
              {
                text: "Pick a new avatar",
                onPress: () => navigate("ChangeAvatar"),
              },
              {
                text: "Erase all my data",
                color: "destructive",
                onPress: () =>
                  Alert.alert(
                    "Are you sure?",
                    "All your posts and hashtags are going to be deleted.",
                    [
                      { text: "Dismiss", onPress: () => {} },
                      {
                        text: "Confirm",
                        style: "destructive",
                        onPress: () => flushDatabase(),
                      },
                    ]
                  ),
              },
            ]}
          />
          <SettingsSection
            title="About"
            actions={[
              {
                text: "Source",
                onPress: () =>
                  Linking.openURL("https://github.com/meo-app/meo"),
              },
            ]}
          />
          <SettingsDataSection />
          <SettingsThemingSection />
          {isDeveloper && (
            <SettingsSection
              title="Developer Options"
              actions={[
                {
                  text: "Create dummy posts",
                  onPress: () => createDummyPosts(),
                },
                {
                  text: "Reset onboarding",
                  onPress: () => flushOnboarding(),
                },
              ]}
            />
          )}
          <Frame height="largest" />
        </ScrollView>
      </Frame>
    </Frame>
  );
}

export { Settings };

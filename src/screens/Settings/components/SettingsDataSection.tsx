import React from "react";
import { transparentize } from "polished";
import { Alert, Modal } from "react-native";
import { Font } from "../../../components/Font";
import { Frame } from "../../../components/Frame";
import { useDownloadBackupHandler } from "../hooks/use-download-backup-handler";
import { useUploadBackupHandler } from "../hooks/use-upload-backup-handler";
import { SettingsSection } from "./SettingsSection";
import { useTheme } from "../../../providers/Theming/hooks/use-theme";

function SettingsDataSection() {
  const { mutate: handleUploadBackup, isLoading } = useUploadBackupHandler({
    onSuccess: () => {
      Alert.alert("Backup uploaded");
    },
  });
  const theme = useTheme();
  const { mutate: handleDownloadBackup } = useDownloadBackupHandler({
    onSuccess: () => {
      Alert.alert("Backup downloaded");
    },
  });
  return (
    <>
      <SettingsSection
        title="My data"
        actions={[
          {
            text: "Upload backup",
            onPress: () => handleUploadBackup(),
          },
          {
            text: "Dowload a backup",
            onPress: () => handleDownloadBackup(),
          },
        ]}
      />
      <Modal visible={isLoading} animationType="slide" transparent={true}>
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
    </>
  );
}

export { SettingsDataSection };

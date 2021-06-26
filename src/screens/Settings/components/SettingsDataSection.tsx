import React from "react";
import { Alert } from "react-native";
import { useDownloadBackupHandler } from "../hooks/use-download-backup-handler";
import { useUploadBackupHandler } from "../hooks/use-upload-backup-handler";
import { SettingsSection } from "./SettingsSection";

function SettingsDataSection() {
  const { mutate: handleUploadBackup } = useUploadBackupHandler({
    onSuccess: () => {
      Alert.alert("Backup uploaded");
    },
  });
  const { mutate: handleDownloadBackup } = useDownloadBackupHandler({
    onSuccess: () => {
      Alert.alert("Backup downloaded");
    },
  });
  return (
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
  );
}

export { SettingsDataSection };

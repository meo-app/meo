import { useCallback } from "react";
import { Alert } from "react-native";
import RNHapticFeedback from "react-native-haptic-feedback";

function useDeletePostAlert({
  onDeletePress,
  onCancelPress,
}: {
  onDeletePress: () => void;
  onCancelPress?: () => void;
}) {
  const openDeleteAlert = useCallback(() => {
    RNHapticFeedback.trigger("impactHeavy", {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    Alert.alert("Delete post", "This action cannot be undone. Are you sure?", [
      { text: "Cancel", style: "cancel", onPress: () => onCancelPress?.() },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDeletePress,
      },
    ]);
  }, [onCancelPress, onDeletePress]);

  return {
    openDeleteAlert,
  };
}
export { useDeletePostAlert };

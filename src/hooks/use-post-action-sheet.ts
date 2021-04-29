import { useActionSheet } from "@expo/react-native-action-sheet";
import { useCallback, useMemo } from "react";
import Share from "react-native-share";
import { useTheme } from "../providers/Theming/Theming";
import { useDeletePost } from "./use-delete-post";
import { useDeletePostAlert } from "./use-delete-post-alert";
import RNHapticFeedback from "react-native-haptic-feedback";
import Clipboard from "@react-native-clipboard/clipboard";

function usePostActionSheet({
  id,
  value,
  deleteMutationOptions,
}: {
  id: string;
  value: string;
  deleteMutationOptions?: Parameters<typeof useDeletePost>[0];
}) {
  const theme = useTheme();
  const { mutateAsync: deletePost } = useDeletePost(deleteMutationOptions);
  const { openDeleteAlert } = useDeletePostAlert({
    onDeletePress: () => deletePost({ id }),
  });
  const { showActionSheetWithOptions } = useActionSheet();
  const { Actions, options } = useMemo(() => {
    const options = ["Delete", "Copy", "Share", "Close"];
    enum Actions {
      Delete = options.indexOf("Delete"),
      Share = options.indexOf("Share"),
      Copy = options.indexOf("Copy"),
    }

    return {
      Actions,
      options,
    };
  }, []);

  const showPostActionSheet = useCallback(() => {
    RNHapticFeedback.trigger("contextClick", {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    showActionSheetWithOptions(
      {
        options,
        autoFocus: true,
        destructiveButtonIndex: 0,
        cancelButtonIndex: options.indexOf("Close"),
        tintColor: theme.colors.primary,
        useModal: true,
        destructiveColor: theme.colors.destructive,
        containerStyle: {
          borderRadius: theme.constants.borderRadius,
          backgroundColor: theme.colors.background,
        },
      },
      (index) => {
        switch (index) {
          case Actions.Copy: {
            Clipboard.setString(value);
            return;
          }
          case Actions.Share: {
            Share.open({
              message: value,
            });
            break;
          }
          case Actions.Delete: {
            openDeleteAlert();
            break;
          }
        }
      }
    );
  }, [
    Actions.Copy,
    Actions.Delete,
    Actions.Share,
    openDeleteAlert,
    options,
    showActionSheetWithOptions,
    theme.colors.background,
    theme.colors.destructive,
    theme.colors.primary,
    theme.constants.borderRadius,
    value,
  ]);

  return {
    showPostActionSheet,
  };
}

export { usePostActionSheet };

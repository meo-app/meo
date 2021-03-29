import { useActionSheet } from "@expo/react-native-action-sheet";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useCallback, useMemo } from "react";
import Share from "react-native-share";
import { useTheme } from "../providers/Theming";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";
import { useDeletePost } from "./use-delete-post";
import { useDeletePostAlert } from "./use-delete-post-alert";

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
  const { navigate } = useNavigation<NavigationProp<NavigationParamsConfig>>();
  const { mutateAsync: deletePost } = useDeletePost(deleteMutationOptions);
  const { openDeleteAlert } = useDeletePostAlert({
    onDeletePress: () => deletePost({ id }),
  });
  const { showActionSheetWithOptions } = useActionSheet();
  const { Actions, options } = useMemo(() => {
    const options = ["Delete", "Edit", "Share", "Close"];
    enum Actions {
      Delete = options.indexOf("Delete"),
      Edit = options.indexOf("Edit"),
      Share = options.indexOf("Share"),
    }

    return {
      Actions,
      options,
    };
  }, []);

  const showPostActionSheet = useCallback(() => {
    showActionSheetWithOptions(
      {
        options,
        autoFocus: true,
        destructiveButtonIndex: 0,
        cancelButtonIndex: 3,
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
          case Actions.Share: {
            Share.open({
              message: value,
            });
            break;
          }
          case Actions.Edit: {
            navigate("PostDetails", {
              id,
              editPostEnabled: true,
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
    Actions.Delete,
    Actions.Edit,
    Actions.Share,
    id,
    navigate,
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

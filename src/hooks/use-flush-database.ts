import { Alert } from "react-native";
import { useMutation, UseMutationOptions, useQueryClient } from "react-query";
import { useSQLiteMutation } from "./use-sqlite-mutation";

function useFlushDatabase(options?: UseMutationOptions) {
  const client = useQueryClient();
  const { mutateAsync: deletePosts } = useSQLiteMutation({
    mutation: "drop table posts;",
    variables: () => [],
  });

  const { mutateAsync: deleteHashtags } = useSQLiteMutation({
    mutation: "drop table hashtags",
    variables: () => [],
  });

  return useMutation(() => Promise.all([deleteHashtags(), deletePosts()]), {
    ...options,
    onSuccess: (data, variables, context) => {
      client.clear();
      Alert.alert("Data erased. Restart the app to continue");
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export { useFlushDatabase };

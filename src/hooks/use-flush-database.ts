import { useMutation, UseMutationOptions } from "react-query";
import { useSQLiteMutation } from "./use-sqlite-mutation";

function useFlushDatabase(options?: UseMutationOptions) {
  const { mutateAsync: deletePosts } = useSQLiteMutation({
    mutation: "delete from posts;",
    variables: () => [],
  });

  const { mutateAsync: deleteHashtags } = useSQLiteMutation({
    mutation: "delete from hashtags;",
    variables: () => [],
  });

  return useMutation(
    () => Promise.all([deleteHashtags(), deletePosts()]),
    options
  );
}

export { useFlushDatabase };

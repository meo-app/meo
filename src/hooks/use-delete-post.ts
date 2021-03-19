import { useMutation, UseMutationOptions, useQueryClient } from "react-query";
import { QueryKeys } from "../shared/QueryKeys";
import { useSQLiteMutation } from "./use-sqlite-mutation";

interface Variables {
  id: string;
}

//
function useDeletePost(
  options: UseMutationOptions<void, string, Variables> = {}
) {
  const client = useQueryClient();
  const { mutateAsync: deletePost } = useSQLiteMutation<Variables>({
    variables: ({ id }) => [id],
    mutation: "delete from posts where id = (?)",
  });

  const { mutateAsync: deleteHashtags } = useSQLiteMutation<Variables>({
    variables: ({ id }) => [id],
    mutation: "delete from hashtags where post_id = (?)",
  });

  return useMutation<void, string, Variables>(
    async ({ id }) => {
      await deletePost({ id });
      await deleteHashtags({ id });
    },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        client.invalidateQueries([QueryKeys.POSTS]);
        client.invalidateQueries([QueryKeys.HASHTAG_VIEWER]);
        client.invalidateQueries([QueryKeys.SEARCH]);
        client.invalidateQueries([QueryKeys.TOP_HASHTAGS]);
        client.invalidateQueries([QueryKeys.TOTAL_OF_POSTS]);
        client.invalidateQueries([QueryKeys.TOTAL_OF_HASHTAGS]);
        options.onSuccess?.(data, variables, context);
      },
    }
  );
}

export { useDeletePost };

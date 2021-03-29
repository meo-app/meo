import { useMutation, UseMutationOptions } from "react-query";
import { useInvalidatePosts } from "./use-invalidate-posts";
import { useSQLiteMutation } from "./use-sqlite-mutation";

interface Variables {
  id: string;
}

function useDeletePost(
  options: UseMutationOptions<void, string, Variables> = {}
) {
  const { mutate: invalidatePosts } = useInvalidatePosts();
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
        invalidatePosts({ id: variables.id });
        options.onSuccess?.(data, variables, context);
      },
    }
  );
}

export { useDeletePost };

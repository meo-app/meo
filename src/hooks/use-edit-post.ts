import { useMutation, UseMutationOptions, useQueryClient } from "react-query";
import { extractHashtags } from "../shared/hashtag-utils";
import { QueryKeys } from "../shared/QueryKeys";
import { Post } from "../shared/SQLiteEntities";
import { useInsertHashtags } from "./use-insert-hashtags";
import { useInvalidatePosts } from "./use-invalidate-posts";
import { useSQLiteMutation } from "./use-sqlite-mutation";

interface Variables {
  id: string;
  text: string;
}

function useEditPost(
  { id }: Pick<Variables, "id">,
  options: UseMutationOptions<void, string, Variables> = {}
) {
  const queryClient = useQueryClient();
  const { mutate: invalidatePosts } = useInvalidatePosts();
  const { mutateAsync: insertHashtag } = useInsertHashtags();
  const { mutateAsync: editPost } = useSQLiteMutation<Pick<Variables, "text">>({
    variables: ({ text }) => [text],
    mutation: `update posts set value = (?) where id = ${id}`,
  });
  const { mutateAsync: deleteHashtags } = useSQLiteMutation<
    Pick<Variables, "id">
  >({
    variables: ({ id }) => [id],
    mutation: "delete from hashtags where post_id = (?)",
  });

  return useMutation<void, string, Variables>(
    async ({ id, text }) => {
      await deleteHashtags({ id });
      await editPost({ text });
      const hashtags = extractHashtags(text);
      await Promise.all(
        hashtags.map((hashtag) =>
          insertHashtag({
            hashtag,
            postId: Number(id),
          })
        )
      );
    },
    {
      ...options,
      onMutate: async ({ text }) => {
        await queryClient.cancelQueries([QueryKeys.POST_DETAILS, id]);
        const previoustPost = queryClient.getQueryData([
          QueryKeys.POST_DETAILS,
          id,
        ]);

        queryClient.setQueryData<Post[]>(
          [QueryKeys.POST_DETAILS, id],
          (previous) => {
            const post = previous?.[0];
            if (post) {
              return [
                {
                  ...post,
                  value: text,
                },
              ];
            }

            return [];
          }
        );

        return { previoustPost };
      },
      onSuccess: (data, variables, context) => {
        invalidatePosts();
        options.onSuccess?.(data, variables, context);
      },
    }
  );
}

export { useEditPost };

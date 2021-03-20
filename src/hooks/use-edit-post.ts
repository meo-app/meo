import { useMutation, UseMutationOptions } from "react-query";
import { extractHashtags } from "../shared/hashtag-utils";
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
      onSuccess: (data, variables, context) => {
        invalidatePosts();
        options.onSuccess?.(data, variables, context);
      },
    }
  );
}

export { useEditPost };

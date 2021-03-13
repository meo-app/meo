import { useMutation, UseMutationOptions, useQueryClient } from "react-query";
import { extractHashtags } from "../shared/hashtag-utils";
import { QueryKeys } from "../shared/QueryKeys";
import { useInsertHashtags } from "./use-insert-hashtags";
import { useSQLiteMutation } from "./use-sqlite-mutation";

interface Variables {
  id: string;
  text: string;
}

function useEditPost(
  { id }: Pick<Variables, "id">,
  options: UseMutationOptions<void, string, Variables> = {}
) {
  const client = useQueryClient();
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
        client.invalidateQueries([QueryKeys.POSTS]);
        client.invalidateQueries([QueryKeys.HASHTAG_VIEWER]);
        client.invalidateQueries([QueryKeys.SEARCH]);
        client.invalidateQueries([QueryKeys.TOP_HASHTAGS]);
        options.onSuccess?.(data, variables, context);
      },
    }
  );
}

export { useEditPost };

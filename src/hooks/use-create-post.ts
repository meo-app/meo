import { useMutation, UseMutationOptions, useQueryClient } from "react-query";
import { extractHashtags } from "../shared/hashtag-utils";
import { QueryKeys } from "../shared/QueryKeys";
import { useInsertHashtags } from "./use-insert-hashtags";
import { useSQLiteMutation } from "./use-sqlite-mutation";

interface Variables {
  text: string;
}

interface Data {
  postId: number;
}

function useCreatePost(options?: UseMutationOptions<Data, string, Variables>) {
  const client = useQueryClient();
  const { mutateAsync: insertHashtag } = useInsertHashtags();
  const { mutateAsync: insertPost } = useSQLiteMutation<{ text: string }>({
    mutation: "insert into posts (value) values (?)",
    variables: ({ text }) => [text],
  });

  return useMutation<Data, string, Variables>(
    async ({ text }) => {
      const hashtags = extractHashtags(text);
      const { insertId: postId } = await insertPost({ text });
      await Promise.all(
        hashtags.map((hashtag) =>
          insertHashtag({
            hashtag,
            postId,
          })
        )
      );
      return {
        postId,
      };
    },
    {
      ...options,
      onSuccess: (...args) => {
        client.invalidateQueries([QueryKeys.POSTS]);
        client.invalidateQueries([QueryKeys.TOP_HASHTAGS]);
        client.invalidateQueries([QueryKeys.TOTAL_OF_POSTS]);
        client.invalidateQueries([QueryKeys.TOTAL_OF_HASHTAGS]);
        options?.onSuccess?.call(null, ...args);
      },
    }
  );
}

export { useCreatePost };

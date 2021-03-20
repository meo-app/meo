import { useMutation, UseMutationOptions } from "react-query";
import { extractHashtags } from "../shared/hashtag-utils";
import { useInsertHashtags } from "./use-insert-hashtags";
import { useInvalidatePosts } from "./use-invalidate-posts";
import { useSQLiteMutation } from "./use-sqlite-mutation";

interface Variables {
  text: string;
}

interface Data {
  postId: number;
}

function useCreatePost(options?: UseMutationOptions<Data, string, Variables>) {
  const { mutate: invalidatePosts } = useInvalidatePosts();
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
        invalidatePosts();
        options?.onSuccess?.call(null, ...args);
      },
    }
  );
}

export { useCreatePost };

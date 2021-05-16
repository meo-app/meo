import { useMutation, UseMutationOptions } from "react-query";
import { extractHashtags } from "../shared/hashtag-utils";
import { useInsertHashtags } from "./use-insert-hashtags";
import { useInvalidatePosts } from "./use-invalidate-posts";
import { useSQLiteMutation } from "./use-sqlite-mutation";

interface Variables {
  text: string;
  timestamp?: string;
}

interface Data {
  postId: number;
}

function useCreatePost(options?: UseMutationOptions<Data, string, Variables>) {
  const { mutate: invalidatePosts } = useInvalidatePosts();
  const { mutateAsync: insertHashtag } = useInsertHashtags();
  const { mutateAsync: insertPost } = useSQLiteMutation<Variables>({
    mutation: "insert into posts (value) values (?)",
    variables: ({ text }) => [text],
  });

  const { mutateAsync: insertPostFromBackup } = useSQLiteMutation<Variables>({
    mutation: "insert into posts (value, timestamp) values (?, ?)",
    variables: ({ text, timestamp }) => [text, timestamp],
  });

  return useMutation<Data, string, Variables>(
    async ({ text, timestamp }) => {
      const hashtags = extractHashtags(text);

      let postId: number;
      if (timestamp) {
        const { insertId } = await insertPostFromBackup({ text, timestamp });
        postId = insertId;
      } else {
        const { insertId } = await insertPost({ text });
        postId = insertId;
      }

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

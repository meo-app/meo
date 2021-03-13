import { useSQLiteMutation } from "./use-sqlite-mutation";

function useInsertHashtags() {
  return useSQLiteMutation<{
    hashtag: string;
    postId: number;
  }>({
    mutation: "insert into hashtags (value, post_id) values (?, ?)",
    variables: ({ hashtag, postId }) => [hashtag, postId],
  });
}

export { useInsertHashtags };

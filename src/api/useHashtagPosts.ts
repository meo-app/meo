import { UseQueryOptions } from "react-query";
import { Post } from "./Entities";
import { QueryIds } from "./QueryIds";
import { useTransaction } from "./useTransaction";

function useHashtagPosts(
  { hashtag }: { hashtag: string },
  options?: UseQueryOptions<Post[]>
) {
  return useTransaction<Post>(
    QueryIds.hashtagViewer + hashtag,
    `select * from posts where id in (select post_id from hashtags where value like "%${hashtag}%") order by timestamp desc`,
    { ...options }
  );
}

export { useHashtagPosts };

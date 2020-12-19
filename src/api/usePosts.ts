import { Post } from "./Entities";
import { useTransaction } from "./useTransaction";
import { QueryIds } from "./QueryIds";

function usePosts() {
  return useTransaction<Post>(
    QueryIds.posts,
    "select * from posts order by id desc"
  );
}

export { usePosts };

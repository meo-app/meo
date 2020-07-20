import { Post } from "./Entities";
import { useTransaction } from "./useTransaction";

function usePosts() {
  return useTransaction<Post>("posts", "select * from posts order by id desc");
}

export { usePosts };

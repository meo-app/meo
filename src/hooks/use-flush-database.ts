import { useState } from "react";
import { QueryKeys } from "../shared/QueryKeys";
import { useTransaction } from "./use-transaction";

// TODO: useTransaction w/ mutation
function useFlushDatabase() {
  const [enabled, setEnable] = useState(false);

  useTransaction<null>(QueryKeys.FLUSH_POSTS, "delete from posts;", {
    enabled,
  });

  useTransaction<null>(QueryKeys.FLUSH_HASHTAGS, "delete from hashtags;", {
    enabled,
  });

  return () => setEnable(true);
}

export { useFlushDatabase };

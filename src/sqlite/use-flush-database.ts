import { useState } from "react";
import { QueryIds } from "./QueryIds";
import { useTransaction } from "./use-transaction";

function useFlushDatabase() {
  const [enabled, setEnable] = useState(false);

  useTransaction<null>(QueryIds.flushPosts, "delete from posts;", {
    enabled,
  });

  useTransaction<null>(QueryIds.flushHashtags, "delete from hashtags;", {
    enabled,
  });

  return () => setEnable(true);
}

export { useFlushDatabase };

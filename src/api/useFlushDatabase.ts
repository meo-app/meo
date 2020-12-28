import { useTransaction } from "./useTransaction";
import { Query } from "react-query";
import { QueryIds } from "./QueryIds";
import { useState } from "react";

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

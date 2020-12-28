import { useTransaction } from "./useTransaction";
import { Query } from "react-query";
import { QueryIds } from "./QueryIds";
import { useState } from "react";

function useFlushDatabase() {
  const [enabled, setEnable] = useState(false);
  useTransaction<null>(QueryIds.flushDatabase, "delete from posts;", {
    enabled,
  });

  useTransaction<null>("hashtagsflush", "delete from hashtags;", {
    enabled,
    onSuccess: () => {
      console.log("sucess");
    },
  });

  return () => setEnable(true);
}

export { useFlushDatabase };

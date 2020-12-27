import { useEffect, useRef } from "react";
import { useQueryClient } from "react-query";
import { Post } from "./Entities";
import { QueryIds } from "./QueryIds";
import { useTransaction } from "./useTransaction";

function useSearch(text?: string) {
  const client = useQueryClient();
  const ref = useRef(text);
  const result = useTransaction<Post>(
    QueryIds.search,
    `select * from posts where value like "%${text}%" collate nocase order by id desc`,
    {
      enabled: Boolean(text),
    }
  );

  useEffect(() => {
    if (ref.current !== text) {
      ref.current = text;
      client.invalidateQueries([QueryIds.search]);
      // result.refetch();
      ref.current = text;
    }
  }, [client, result, text]);

  return result;
}

export { useSearch };

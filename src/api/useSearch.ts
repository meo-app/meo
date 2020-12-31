import { useEffect, useRef } from "react";
import { useQueryClient } from "react-query";
import { Post } from "./Entities";
import { QueryIds } from "./QueryIds";
import { useTransaction } from "./useTransaction";

function useSearch(term?: string) {
  const client = useQueryClient();
  const ref = useRef(term);
  const result = useTransaction<Post>(
    QueryIds.search,
    `select * from posts where value like "%${term}%" collate nocase order by id desc`,
    {
      enabled: Boolean(term),
    }
  );

  useEffect(() => {
    if (ref.current !== term) {
      ref.current = term;
      client.invalidateQueries([QueryIds.search]);
    }
  }, [client, result, term]);

  return result;
}

export { useSearch };

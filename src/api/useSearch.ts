import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { Post } from "./Entities";
import { QueryIds } from "./QueryIds";
import { useTransaction } from "./useTransaction";

function useSearch(text?: string) {
  const client = useQueryClient();
  const result = useTransaction<Post>(
    QueryIds.search,
    `select * from posts where value like "%${text}%" collate nocase order by id desc`,
    {
      enabled: Boolean(text),
    }
  );

  useEffect(() => {
    client.invalidateQueries([QueryIds.search]);
    result.refetch();
  }, [text]);

  return result;
}

export { useSearch };

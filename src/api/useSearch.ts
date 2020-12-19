import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { Post } from "./Entities";
import { useTransaction } from "./useTransaction";

function useSearch(text?: string) {
  const client = useQueryClient();
  const result = useTransaction<Post>(
    // TODO: enum with query id's
    "search",
    `select * from posts where value like "%${text}%" order by id desc`,
    {
      enabled: Boolean(text),
    }
  );

  useEffect(() => {
    client.invalidateQueries(["search"]);
    result.refetch();
  }, [text]);

  return result;
}

export { useSearch };

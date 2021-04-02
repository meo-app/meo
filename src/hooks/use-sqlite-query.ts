import { useEffect, useRef } from "react";
import { QueryKey, useQuery, UseQueryOptions } from "react-query";
import { useDB } from "../providers/SQLiteProvider";

function useSQLiteQuery<T>({
  query,
  queryKey,
  options,
}: {
  queryKey: QueryKey;
  query: string;
  options?: UseQueryOptions<T[]>;
}) {
  const ref = useRef(query);
  const db = useDB();
  const result = useQuery(
    queryKey,
    () =>
      new Promise<T[]>((resolve, reject) => {
        db.transaction(
          (tx) =>
            tx.executeSql(query, [], (_, { rows }) => {
              resolve(
                [...Array(rows.length).keys()].map((index) => rows.item(index))
              );
            }),
          (err) => {
            console.error(
              `Error while fetching ${queryKey} . \nCode: ${err.code}. \nMessage ${err.message} `
            );

            reject(err);
          }
        );
      }),
    {
      ...options,
    }
  );

  useEffect(() => {
    if (query !== ref.current) {
      ref.current = query;
      result.refetch();
    }
  }, [result, query]);

  return result;
}

export { useSQLiteQuery };

import { useEffect, useRef } from "react";
import { useQuery, UseQueryOptions } from "react-query";
import { useDB } from "../application/providers/SQLiteProvider";
import { QueryIds } from "./QueryIds";

function useTransaction<T>(
  id: QueryIds,
  query: string,
  options?: UseQueryOptions<T[]>
) {
  const ref = useRef(query);
  const db = useDB();
  const result = useQuery(
    id,
    () =>
      new Promise<T[]>((resolve, reject) => {
        db.transaction(
          (tx) =>
            tx.executeSql(query, [], (_, { rows }) => {
              console.log("transaction", { query });
              resolve(
                [...Array(rows.length).keys()].map((index) => rows.item(index))
              );
            }),
          (err) => {
            console.error(
              `Error while fetching ${id} . \nCode: ${err.code}. \nMessage ${err.message} `
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

export { useTransaction };

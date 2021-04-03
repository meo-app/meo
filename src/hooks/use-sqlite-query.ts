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

  return result;
}

export { useSQLiteQuery };

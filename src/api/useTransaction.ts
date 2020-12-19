import { useQuery, UseQueryOptions } from "react-query";
import { useDB } from "../application/providers/SQLiteProvider";
import { QueryIds } from "./QueryIds";

function useTransaction<T>(
  id: QueryIds,
  query: string,
  options?: UseQueryOptions<T[]>
) {
  const db = useDB();
  return useQuery(
    id,
    () =>
      new Promise<T[]>((resolve, reject) => {
        db.transaction(
          (tx) =>
            tx.executeSql(query, [], (_, { rows }) =>
              resolve(
                [...Array(rows.length).keys()].map((index) => rows.item(index))
              )
            ),
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
}

export { useTransaction };

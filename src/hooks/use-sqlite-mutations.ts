import { MutationOptions, useMutation } from "react-query";
import { useDB } from "../application/providers/SQLiteProvider";

type MapVariables<TVariables = void> = (
  variables: TVariables,
  ...args: SQLResultSet[]
) => any[] | undefined;

function useSqliteMutations<TVariables = void>({
  mutations,
  mapVariables,
  options,
}: {
  mutations: string[];
  mapVariables: MapVariables<TVariables>;
  options?: MutationOptions<SQLResultSet[], string, TVariables>;
}) {
  const db = useDB();
  return useMutation<SQLResultSet[], string, TVariables>(
    (variables) => {
      return new Promise((resolve, reject) =>
        db.transaction(
          async (tx) => {
            const results: SQLResultSet[] = [];
            for (const current of mutations) {
              await new Promise<SQLResultSet>((r) => {
                tx.executeSql(
                  current,
                  mapVariables(variables, ...results),
                  (_, result) => {
                    results.push(result);
                    r(result);
                  }
                );
              });
            }

            resolve(results);
          },
          (err) => {
            console.error(
              `sqllite mutation error \nCode: ${err.code}. \nMessage ${err.message} `
            );
            reject(err);
          }
        )
      );
    },
    {
      ...options,
    }
  );
}

export { useSqliteMutations };

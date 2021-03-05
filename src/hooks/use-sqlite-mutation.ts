import { MutationOptions, useMutation } from "react-query";
import { useDB } from "../application/providers/SQLiteProvider";

type MapVariables<TVariables = void> = (
  variables: TVariables
) => any[] | undefined;

function useSqliteMutation<TVariables = void>({
  mutation,
  mapVariables,
  options,
}: {
  mutation: string;
  mapVariables: MapVariables<TVariables>;
  options?: MutationOptions<SQLTransaction, string, TVariables>;
}) {
  const db = useDB();
  return useMutation<SQLTransaction, string, TVariables>(
    (variables) => {
      return new Promise((resolve, reject) =>
        db.transaction(
          (tx) => {
            tx.executeSql(mutation, mapVariables(variables), (_, transaction) =>
              resolve((transaction as unknown) as SQLTransaction)
            );
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

export { useSqliteMutation };

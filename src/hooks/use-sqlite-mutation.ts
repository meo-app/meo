import { MutationOptions, useMutation } from "react-query";
import { useDB } from "../application/providers/SQLiteProvider";

type Variables<TVariables = void> = (
  variables: TVariables
) => any[] | undefined;

function useSQLiteMutation<TVariables = void>({
  mutation,
  variables,
  options,
}: {
  mutation: string;
  variables: Variables<TVariables>;
  options?: MutationOptions<SQLResultSet, string, TVariables>;
}) {
  const db = useDB();
  return useMutation<SQLResultSet, string, TVariables>((args) => {
    return new Promise((resolve, reject) =>
      db.transaction(
        (tx) => {
          tx.executeSql(mutation, variables(args), (_, result) =>
            resolve(result)
          );
        },
        (err) => {
          console.error(
            `sqlite mutation error \nCode: ${err.code}. \nMessage ${err.message} `
          );
          reject(err);
        }
      )
    );
  }, options);
}

export { useSQLiteMutation };

import { useMutation, queryCache } from "react-query";
import { useDB } from "../application/providers/SQLiteProvider";

function useCreatePost(options: Parameters<typeof useMutation>[1]) {
  const db = useDB();
  return useMutation<undefined, { text: string }>(
    ({ text }) =>
      new Promise((resolve, reject) =>
        db.transaction(
          (tx) => {
            // TODO: handle tags?
            tx.executeSql("insert into posts (value) values (?)", [text]);
            resolve();
          },
          (err) => {
            console.error(
              `Error while creating post. \nCode: ${err.code}. \nMessage ${err.message} `
            );
            reject(err);
          }
        )
      ),
    {
      ...options,
      onSuccess: (...args) => {
        // Looks like invalidateQueries is missing from ts definitions
        // @ts-ignore
        queryCache.invalidateQueries(["posts"]);
        options?.onSuccess?.call(null, ...args);
      },
    }
  );
}

export { useCreatePost };

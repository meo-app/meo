import { MutationOptions, useMutation, useQueryClient } from "react-query";
import { useDB } from "../application/providers/SQLiteProvider";
import { Post } from "./Entities";

function useCreatePost(
  options: MutationOptions<Post, unknown, { text: string }>
) {
  const db = useDB();
  const client = useQueryClient();
  return useMutation<Post, unknown, { text: string }>(
    ({ text }) =>
      new Promise((resolve, reject) =>
        db.transaction(
          (tx) => {
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
        client.invalidateQueries(["posts"]);
        options?.onSuccess?.call(null, ...args);
      },
    }
  );
}

export { useCreatePost };

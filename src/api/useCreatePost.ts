import { MutationOptions, useMutation, useQueryClient } from "react-query";
import { useDB } from "../application/providers/SQLiteProvider";
import { Post } from "./Entities";
import { HASHTAG_REGEX } from "../utils/hashtag-regex";
import { QueryIds } from "./QueryIds";

function useCreatePost(
  options: MutationOptions<Post, unknown, { text: string }>
) {
  const db = useDB();
  const client = useQueryClient();
  return useMutation<Post, unknown, { text: string }>(
    ({ text }) => {
      const hashtags = text
        .split(HASHTAG_REGEX)
        .filter((item) => /#/.test(item));
      return new Promise((resolve, reject) =>
        db.transaction(
          (tx) => {
            tx.executeSql(
              "insert into posts (value) values (?)",
              [text],
              (_, { insertId }) => {
                if (hashtags.length) {
                  Promise.all(
                    hashtags.map((value) =>
                      tx.executeSql(
                        "insert into hashtags (value, post_id) values (?, ?)",
                        [value, insertId]
                      )
                    )
                  ).then(() => resolve());
                } else {
                  resolve();
                }
              }
            );
          },
          (err) => {
            console.error(
              `Error while creating post. \nCode: ${err.code}. \nMessage ${err.message} `
            );
            reject(err);
          }
        )
      );
    },
    {
      ...options,
      onSuccess: (...args) => {
        // Note: react-query may have a bug where adding multiple query ids to invalidate doesnt work (aka: [QueryIds.posts, QueryIds.topHashtags])
        // instead calling it twice works
        client.invalidateQueries([QueryIds.posts]);
        client.invalidateQueries([QueryIds.topHashtags]);
        options?.onSuccess?.call(null, ...args);
      },
    }
  );
}

export { useCreatePost };

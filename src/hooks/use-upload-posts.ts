import { useMutation } from "react-query";
import { useDB } from "../providers/SQLiteProvider";
import { Post } from "../shared/SQLiteEntities";
import { useCreatePost } from "./use-create-post";

interface Result {
  skipped: string[];
  inserted: number;
}

function useUploadBackup() {
  const db = useDB();
  const { mutateAsync: createPost } = useCreatePost();
  return useMutation<Result, string, Pick<Post, "timestamp" | "value">[]>(
    async (posts) => {
      const result: Result = {
        skipped: [],
        inserted: 0,
      };
      for (const post of posts) {
        /**
         * If the post has been inserted in the past / or if there is post with the
         * exact same content we will skip it
         */
        const hasBeenInserted = await new Promise((resolve, reject) =>
          db.transaction(
            (tx) =>
              tx.executeSql(
                `select id from posts where value = "${post.value}" collate nocase`,
                [],
                (_, { rows }) => resolve(Boolean(rows.length))
              ),
            (err) => {
              console.log("Error!", { err });
              reject(err);
            }
          )
        );

        if (hasBeenInserted) {
          result.skipped.push(post.value);
          continue;
        }

        /**
         * createPost handles hashtags
         * */
        await createPost({ text: post.value, timestamp: post.timestamp });
        result.inserted++;
      }

      return result;
    }
  );
}

export { useUploadBackup };

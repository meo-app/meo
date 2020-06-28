import { useQuery } from "react-query";
import { Post } from "./Entities";
import { useDB } from "../application/providers/SQLiteProvider";

function usePosts() {
  const db = useDB();
  return useQuery(
    "posts",
    () =>
      new Promise<Post[]>((resolve, reject) => {
        db.transaction(
          (tx) => {
            tx.executeSql("select * from posts", [], (_, { rows }) => {
              resolve(
                [...Array(rows.length).keys()].map((index) => rows.item(index))
              );
            });
          },
          (err) => {
            console.error(
              `Error while fetching posts. \nCode: ${err.code}. \nMessage ${err.message} `
            );
            reject(err);
          }
        );
      })
  );
}

export { usePosts };

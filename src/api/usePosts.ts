import { useInfiniteQuery } from "react-query";
import { useDB } from "../application/providers/SQLiteProvider";
import { Post } from "./Entities";
import { QueryIds } from "./QueryIds";

const POSTS_PER_PAGE = 40;
function usePosts() {
  const db = useDB();
  const { data, ...result } = useInfiniteQuery(
    QueryIds.posts,
    ({ pageParam = 0 }) =>
      new Promise<Post[]>((resolve, reject) => {
        db.transaction(
          (tx) => {
            const query = `select * from posts order by id desc limit ${
              pageParam === 0 ? 0 : POSTS_PER_PAGE * pageParam
            }, ${POSTS_PER_PAGE + 1} `;
            console.log({ query });
            tx.executeSql(query, [], (_, { rows }) => {
              console.log({ rows });
              resolve(
                [...Array(rows.length).keys()].map((index) => rows.item(index))
              );
            });
          },
          (err) => {
            console.error();

            reject(err);
          }
        );
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (allPages.length === 1) {
          return 1;
        }

        if (lastPage.length - 1 === POSTS_PER_PAGE) {
          const result = allPages.length;
          return result;
        }
      },
    }
  );

  const pages =
    data?.pages?.map((page) =>
      page.length <= POSTS_PER_PAGE ? page : page.slice(0, page.length - 1)
    ) || [];

  return {
    ...result,
    data: {
      ...data,
      pages,
    },
  };
}

export { usePosts };

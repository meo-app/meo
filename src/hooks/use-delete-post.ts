import { UseMutationOptions, useQueryClient } from "react-query";
import { QueryKeys } from "../shared/QueryKeys";
import { useSqliteMutations } from "./use-sqlite-mutations";

interface Arguments {
  id: string;
}

function useDeletePost({
  onSuccess,
  ...options
}: UseMutationOptions<SQLResultSet[], string, Arguments> = {}) {
  const client = useQueryClient();
  return useSqliteMutations<Arguments>({
    mapVariables: ({ id }) => [id],
    mutations: [
      "delete from posts where id = (?)",
      "delete from hashtags where post_id = (?) ",
    ],
    options: {
      ...options,
      onSuccess: (data, variables, context) => {
        client.invalidateQueries([QueryKeys.POSTS]);
        client.invalidateQueries([QueryKeys.HASHTAG_VIEWER]);
        client.invalidateQueries([QueryKeys.SEARCH]);
        client.invalidateQueries([QueryKeys.TOP_HASHTAGS]);
        onSuccess?.(data, variables, context);
      },
    },
  });
}

export { useDeletePost };

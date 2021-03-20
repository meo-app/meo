import { useMutation, useQueryClient } from "react-query";
import { QueryKeys } from "../shared/QueryKeys";

function useInvalidatePosts() {
  const client = useQueryClient();
  return useMutation(() => {
    return Promise.all([
      client.invalidateQueries([QueryKeys.POSTS]),
      client.invalidateQueries([QueryKeys.HASHTAG_VIEWER]),
      client.invalidateQueries([QueryKeys.SEARCH]),
      client.invalidateQueries([QueryKeys.TOP_HASHTAGS]),
      client.invalidateQueries([QueryKeys.TOTAL_OF_POSTS]),
      client.invalidateQueries([QueryKeys.TOTAL_OF_HASHTAGS]),
      client.invalidateQueries([QueryKeys.IS_DEVELOPER]),
    ]);
  });
}

export { useInvalidatePosts };

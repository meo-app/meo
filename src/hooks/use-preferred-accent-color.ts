import { useQueryClient } from "react-query";
import { QueryKeys } from "../shared/QueryKeys";
import {
  useAsyncStorageMutation,
  useAsyncStorageQuery,
} from "./use-async-storage";

// TODO: rename accent to primary?
const PREFERRED_ACCENT_COLOR_STORAGE_VERSION = 1;

function usePreferredAccentColorQuery() {
  return useAsyncStorageQuery<string>({
    queryKey: QueryKeys.PREFERRED_ACCENT_COLOR,
    version: PREFERRED_ACCENT_COLOR_STORAGE_VERSION,
    parse: (value) => String(value),
  });
}

function usePreferredAccentColorMutation() {
  const queryClient = useQueryClient();
  // TODO: useAsyncStorageMutation to handle optmistic updates by default?
  return useAsyncStorageMutation<string, { previous?: string }>({
    key: QueryKeys.PREFERRED_ACCENT_COLOR,
    version: PREFERRED_ACCENT_COLOR_STORAGE_VERSION,
    parse: (value) => (value ? String(value) : ""),
    options: {
      onMutate: async (value) => {
        await queryClient.cancelQueries(QueryKeys.PREFERRED_ACCENT_COLOR);
        const previous = queryClient.getQueryData(
          QueryKeys.PREFERRED_ACCENT_COLOR
        ) as string | undefined;

        queryClient.setQueryData(QueryKeys.PREFERRED_ACCENT_COLOR, () => value);
        return { previous };
      },
      onError: (err, value, context) => {
        if (err && context?.previous) {
          queryClient.setQueryData(
            QueryKeys.PREFERRED_COLOR_SCHEME,
            context.previous
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(QueryKeys.PREFERRED_COLOR_SCHEME);
      },
    },
  });
}

export { usePreferredAccentColorQuery, usePreferredAccentColorMutation };

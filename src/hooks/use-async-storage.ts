import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";
import { QueryKeys } from "../shared/QueryKeys";

function useAsyncStorageQuery<TQueryFnData = unknown, TError = unknown>({
  queryKey,
  version,
  parse,
  options,
}: {
  version: number;
  queryKey: QueryKeys;
  parse: (value: string | null) => TQueryFnData;
  options?: UseQueryOptions<TQueryFnData | undefined, TError>;
}) {
  return useQuery<TQueryFnData | undefined, TError>(
    queryKey,
    async () => {
      const [[, data], [, dataVersion]] = await AsyncStorage.multiGet([
        queryKey,
        `${queryKey}-version`,
      ]);

      if (version !== Number(dataVersion)) {
        await AsyncStorage.removeItem(queryKey);
        return;
      }

      return parse(data);
    },
    {
      ...options,
    }
  );
}

function useAsyncStorageMutation<TVariables = void, TContext = unknown>({
  key,
  parse,
  version,
  options,
}: {
  version: number;
  key: QueryKeys;
  parse: (data: TVariables) => string;
  options?: UseMutationOptions<void, string, TVariables, TContext>;
}) {
  const client = useQueryClient();
  return useMutation<void, string, TVariables, TContext>(
    (variables) =>
      AsyncStorage.multiSet([
        [key, parse(variables)],
        [`${key}-version`, String(version)],
      ]),
    {
      ...options,
      onSettled: (data, error, variables, context) => {
        client.invalidateQueries(key);
        options?.onSettled?.(data, error, variables, context);
      },
    }
  );
}

export { useAsyncStorageQuery, useAsyncStorageMutation };

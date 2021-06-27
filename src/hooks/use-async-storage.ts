import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";
import { QueryKeys } from "../shared/QueryKeys";

function useFlushAsyncStorageKey({
  queryKey,
  options,
}: {
  queryKey: QueryKeys;
  options?: UseMutationOptions<void, string, void, { previous?: unknown }>;
}) {
  const queryClient = useQueryClient();
  return useMutation<void, string, void, { previous?: unknown }>(
    () => AsyncStorage.multiRemove([queryKey, `${queryKey}-version`]),
    {
      ...options,
      onMutate: async (value) => {
        if (options?.onMutate) {
          return options?.onMutate(value);
        }

        await queryClient.cancelQueries(queryKey);
        const previous = queryClient.getQueryData(queryKey) as
          | unknown
          | undefined;
        queryClient.setQueryData(queryKey, () => value);
        return { previous };
      },
      onSettled: (data, error, variables, context) => {
        queryClient.invalidateQueries(queryKey);
        options?.onSettled?.(data, error, variables, context);
      },
      onError: (err, value, context) => {
        if (err && context?.previous) {
          queryClient.setQueryData(queryKey, context.previous);
        }
        options?.onError?.(err, value, context);
      },
    }
  );
}

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
  AsyncStorage.getAllKeys().then((keys) => {
    console.log({ keys });
  });
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

function useAsyncStorageMutation<TVariables = void>({
  key,
  parse,
  version,
  options,
}: {
  version: number;
  key: QueryKeys;
  parse: (data: TVariables) => string;
  options?: UseMutationOptions<
    void,
    string,
    TVariables,
    { previous?: unknown }
  >;
}) {
  const queryClient = useQueryClient();
  return useMutation<void, string, TVariables, { previous?: unknown }>(
    (variables) =>
      AsyncStorage.multiSet([
        [key, parse(variables)],
        [`${key}-version`, String(version)],
      ]),
    {
      ...options,
      onMutate: async (value) => {
        if (options?.onMutate) {
          return options?.onMutate(value);
        }

        await queryClient.cancelQueries(key);
        const previous = queryClient.getQueryData(key) as unknown | undefined;
        queryClient.setQueryData(key, () => value);
        return { previous };
      },
      onSettled: (data, error, variables, context) => {
        queryClient.invalidateQueries(key);
        options?.onSettled?.(data, error, variables, context);
      },
      onError: (err, value, context) => {
        if (err && context?.previous) {
          queryClient.setQueryData(key, context.previous);
        }
        options?.onError?.(err, value, context);
      },
    }
  );
}

export {
  useAsyncStorageQuery,
  useAsyncStorageMutation,
  useFlushAsyncStorageKey,
};

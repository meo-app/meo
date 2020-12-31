import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { QueryIds } from "./QueryIds";

const key = "@@selected-avatar";

const get = async () => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? Number(value) : 0;
  } catch (e) {
    throw new Error(e);
  }
};

const set = async (index: number) => {
  try {
    await AsyncStorage.setItem(key, String(index));
  } catch (e) {
    throw new Error(e);
  }
};

const clear = async () => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    throw new Error(e);
  }
};

function useAvatar() {
  return useQuery<number>(QueryIds.getUserAvatar, get);
}

function useSelectAvatar(
  options?: MutationOptions<
    void,
    "Error",
    {
      index: number;
    }
  >
) {
  const client = useQueryClient();
  return useMutation(({ index }) => set(index), {
    ...options,
    onSuccess: (...args) => {
      client.refetchQueries(QueryIds.getUserAvatar);
      options?.onSuccess?.call(null, ...args);
    },
  });
}

export { useAvatar, useSelectAvatar };

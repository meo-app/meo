import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { AvatarIds } from "../shared/avatars-list";
import { QueryKeys } from "../shared/QueryKeys";

const key = "@@selected-avatar";

interface Data {
  avatarId: AvatarIds;
  base64?: string;
}

const get = async () => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as Data) : null;
  } catch (e) {
    throw new Error(e);
  }
};

const set = async (data: Data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    throw new Error(e);
  }
};

function useAvatar() {
  return useQuery<Data | null>(QueryKeys.GET_USER_AVATAR, get);
}

function useSelectAvatar(options?: MutationOptions<void, "Error", Data>) {
  const client = useQueryClient();
  return useMutation((data) => set(data), {
    ...options,
    onSuccess: (...args) => {
      client.refetchQueries(QueryKeys.GET_USER_AVATAR);
      options?.onSuccess?.call(null, ...args);
    },
  });
}

export { useAvatar, useSelectAvatar };

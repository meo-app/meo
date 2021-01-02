import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { AvatarIds } from "../components/Avatars/avatars-list";
import { QueryIds } from "./QueryIds";

const key = "@@selected-avatar";

const get = async () => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value as AvatarIds;
  } catch (e) {
    throw new Error(e);
  }
};

const set = async (id: AvatarIds) => {
  try {
    await AsyncStorage.setItem(key, id);
  } catch (e) {
    throw new Error(e);
  }
};

function useAvatar() {
  return useQuery<AvatarIds>(QueryIds.getUserAvatar, get);
}

function useSelectAvatar(
  options?: MutationOptions<
    void,
    "Error",
    {
      avatarId: AvatarIds;
    }
  >
) {
  const client = useQueryClient();
  return useMutation(({ avatarId }) => set(avatarId), {
    ...options,
    onSuccess: (...args) => {
      client.refetchQueries(QueryIds.getUserAvatar);
      options?.onSuccess?.call(null, ...args);
    },
  });
}

export { useAvatar, useSelectAvatar };

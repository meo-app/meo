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
    parse: (value) => (value ? String(value) : ""),
  });
}

function usePreferredAccentColorMutation() {
  return useAsyncStorageMutation<string>({
    key: QueryKeys.PREFERRED_ACCENT_COLOR,
    version: PREFERRED_ACCENT_COLOR_STORAGE_VERSION,
    parse: (value) => (value ? String(value) : ""),
  });
}

export { usePreferredAccentColorQuery, usePreferredAccentColorMutation };

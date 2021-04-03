import {
  PreferredColorSchemeTypes,
  PREFERRED_COLOR_SCHEME_STORAGE_VERSION,
} from "../shared/color-scheme";
import { QueryKeys } from "../shared/QueryKeys";
import { useAsyncStorageQuery } from "./use-async-storage";

function usePreferredColorSchemeQuery() {
  return useAsyncStorageQuery<PreferredColorSchemeTypes>({
    queryKey: QueryKeys.PREFERRED_COLOR_SCHEME,
    version: PREFERRED_COLOR_SCHEME_STORAGE_VERSION,
    parse: (value) => String(value) as PreferredColorSchemeTypes,
  });
}

export { usePreferredColorSchemeQuery };

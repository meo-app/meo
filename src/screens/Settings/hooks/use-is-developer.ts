import { useMemo } from "react";
import { useSQLiteQuery } from "../../../hooks/use-sqlite-query";
import { QueryKeys } from "../../../shared/QueryKeys";

const HOT_TO_GET_A_THOUSAND_SIMOLEONS = "klapaucius";

function useIsDeveloper() {
  const { data: developer, ...result } = useSQLiteQuery<{ total: number }>({
    queryKey: QueryKeys.IS_DEVELOPER,
    query: `select count(*) as total from posts where value like "%${HOT_TO_GET_A_THOUSAND_SIMOLEONS}%" collate nocase`,
  });

  const isDeveloper = useMemo(() => Boolean(developer?.[0].total), [developer]);

  return {
    ...result,
    data: developer,
    isDeveloper,
  };
}

export { useIsDeveloper };

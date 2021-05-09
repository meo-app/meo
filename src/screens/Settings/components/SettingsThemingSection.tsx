import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQueryClient } from "react-query";
import { Frame } from "../../../components/Frame";
import { Icon } from "../../../components/Icon/Icon";
import { useAsyncStorageMutation } from "../../../hooks/use-async-storage";
import { usePreferredColorSchemeQuery } from "../../../hooks/use-preferred-color-scheme-query";
import { useTheme } from "../../../providers/Theming/hooks/use-theme";
import {
  PreferredColorSchemeTypes,
  PREFERRED_COLOR_SCHEME_STORAGE_VERSION,
} from "../../../shared/color-scheme";
import { QueryKeys } from "../../../shared/QueryKeys";
import { SettingsSection } from "./SettingsSection";

interface FieldValues {
  scheme: PreferredColorSchemeTypes;
}

function Checkmark({ active }: { active?: boolean }) {
  const theme = useTheme();
  return (
    <Frame
      style={{
        height: theme.scales.small,
      }}
    >
      {active && <Icon type="Check" size="small" color="primary" />}
    </Frame>
  );
}

function SettingsThemingSection() {
  const { control, setValue } = useForm<FieldValues>();
  const queryClient = useQueryClient();
  const values = useWatch({ control });
  const { data } = usePreferredColorSchemeQuery();
  const { mutate } = useAsyncStorageMutation<
    PreferredColorSchemeTypes,
    {
      previous?: string;
    }
  >({
    key: QueryKeys.PREFERRED_COLOR_SCHEME,
    version: PREFERRED_COLOR_SCHEME_STORAGE_VERSION,
    parse: (value) => (value ? String(value) : ""),
    options: {
      onMutate: async (value) => {
        await queryClient.cancelQueries(QueryKeys.PREFERRED_COLOR_SCHEME);
        const previous = queryClient.getQueryData(
          QueryKeys.PREFERRED_COLOR_SCHEME
        ) as string | undefined;

        queryClient.setQueryData(QueryKeys.PREFERRED_COLOR_SCHEME, () => value);
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

  useEffect(() => {
    if (values.scheme) {
      mutate(values.scheme);
    } else {
      mutate("system");
    }
  }, [mutate, values]);

  useEffect(() => {
    if (data && !values.scheme) {
      setValue("scheme", data);
    }
  }, [data, setValue, values.scheme]);

  return (
    <SettingsSection
      title="Theming"
      actions={[
        {
          text: "Use system light or dark mode",
          onPress: () => setValue("scheme", "system"),
          children: (
            <Checkmark active={values.scheme === "system" || !values.scheme} />
          ),
        },
        {
          text: "Dark",
          onPress: () => setValue("scheme", "dark"),
          children: <Checkmark active={values.scheme === "dark"} />,
        },
        {
          text: "Light",
          onPress: () => setValue("scheme", "light"),
          children: <Checkmark active={values.scheme === "light"} />,
        },
      ]}
    />
  );
}

export { SettingsThemingSection };

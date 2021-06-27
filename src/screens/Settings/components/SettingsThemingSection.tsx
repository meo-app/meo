import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAsyncStorageMutation } from "../../../hooks/use-async-storage";
import { usePreferredColorSchemeQuery } from "../../../hooks/use-preferred-color-scheme-query";
import {
  PreferredColorSchemeTypes,
  PREFERRED_COLOR_SCHEME_STORAGE_VERSION,
} from "../../../shared/color-scheme";
import { QueryKeys } from "../../../shared/QueryKeys";
import { SettingsSection } from "./SettingsSection";

interface FieldValues {
  scheme: PreferredColorSchemeTypes;
}

function SettingsThemingSection() {
  const { data, isFetched } = usePreferredColorSchemeQuery();
  const { control, setValue } = useForm<FieldValues>({
    defaultValues: {
      ...(data && {
        scheme: data,
      }),
    },
  });
  const values = useWatch({ control });
  const { mutate } = useAsyncStorageMutation<PreferredColorSchemeTypes>({
    key: QueryKeys.PREFERRED_COLOR_SCHEME,
    version: PREFERRED_COLOR_SCHEME_STORAGE_VERSION,
    parse: (value) => (value ? String(value) : ""),
  });

  useEffect(() => {
    if (values.scheme && values.scheme !== data) {
      mutate(values.scheme);
    }
  }, [data, mutate, values]);

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
          ...((values.scheme === "system" ||
            (isFetched && !data && !values.scheme)) && {
            iconType: "Check",
            iconColor: "primary",
          }),
        },
        {
          text: "Dark",
          onPress: () => setValue("scheme", "dark"),
          ...(values.scheme === "dark" && {
            iconType: "Check",
            iconColor: "primary",
          }),
        },
        {
          text: "Light",
          onPress: () => setValue("scheme", "light"),
          ...(values.scheme === "light" && {
            iconType: "Check",
            iconColor: "primary",
          }),
        },
      ]}
    />
  );
}

export { SettingsThemingSection };

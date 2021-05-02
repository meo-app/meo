import { NavigationProp, useNavigation } from "@react-navigation/native";
import { LoremIpsum } from "lorem-ipsum";
import { transparentize } from "polished";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Alert, Linking, Modal, Pressable, ScrollView } from "react-native";
import { useMutation, useQueryClient } from "react-query";
import { Font } from "../components/Font";
import { Frame, useFrame } from "../components/Frame";
import { Icon } from "../components/Icon/Icon";
import { NavigationHeader } from "../components/NavigationHeader";
import { Colors } from "../foundations/Colors";
import { useAsyncStorageMutation } from "../hooks/use-async-storage";
import { useCreatePost } from "../hooks/use-create-post";
import { useFlushDatabase } from "../hooks/use-flush-database";
import { usePreferredColorSchemeQuery } from "../hooks/use-preferred-color-scheme-query";
import { useSQLiteQuery } from "../hooks/use-sqlite-query";
import { usePaddingHorizontal } from "../providers/Theming/hooks/use-padding-horizontal";
import { useTheme } from "../providers/Theming/hooks/use-theme";
import {
  PreferredColorSchemeTypes,
  PREFERRED_COLOR_SCHEME_STORAGE_VERSION,
} from "../shared/color-scheme";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";
import { QueryKeys } from "../shared/QueryKeys";
import { useFlushOnboarding } from "../storage/onboarding";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

const DUMMY_POSTS_SIZE = 100;

function useCreatDummyPosts(times: number = DUMMY_POSTS_SIZE) {
  const { mutateAsync } = useCreatePost();
  return useMutation(() =>
    Promise.all(
      [...Array(times)]
        .map(() => lorem.generateParagraphs(1))
        .map((text) =>
          mutateAsync({
            text: text
              .split(" ")
              .map((word) => (Math.random() <= 0.5 ? `#${word}` : word))
              .join(" "),
          })
        )
    )
  );
}

const HOT_TO_GET_A_THOUSAND_SIMOLEONS = "klapaucius";

function Settings() {
  const theme = useTheme();
  const { navigate } = useNavigation<NavigationProp<NavigationParamsConfig>>();
  const { data: developer } = useSQLiteQuery<{ total: number }>({
    queryKey: QueryKeys.IS_DEVELOPER,
    query: `select count(*) as total from posts where value like "%${HOT_TO_GET_A_THOUSAND_SIMOLEONS}%" collate nocase`,
  });
  const isDeveloper = useMemo(() => Boolean(developer?.[0].total), [developer]);
  const {
    mutate: flushOnboarding,
    isLoading: isFlusingOboarding,
  } = useFlushOnboarding();
  const {
    mutate: flushDatabase,
    isLoading: isFlusingDatabase,
  } = useFlushDatabase();
  const {
    mutate: createDummyPosts,
    isLoading: isCreatingDummyPosts,
  } = useCreatDummyPosts();

  return (
    <Frame flex={1} backgroundColor="background">
      <Modal
        animationType="slide"
        transparent={true}
        visible={
          isFlusingDatabase || isCreatingDummyPosts || isFlusingOboarding
        }
      >
        <Frame
          flex={1}
          alignItems="center"
          justifyContent="center"
          style={{
            backgroundColor: transparentize(
              0.09,
              theme.colors.backgroundAccent
            ),
          }}
        >
          <Font>Loading...</Font>
        </Frame>
      </Modal>
      <NavigationHeader title="Settings" />
      <Frame flex={1} backgroundColor="backgroundAccent">
        <ScrollView>
          <Title text="Options" />
          <Button
            onPress={() => navigate("ChangeAvatar")}
            title="Pick a new avatar"
          />
          <Button
            onPress={() =>
              Alert.alert(
                "Are you sure?",
                "All your posts and hashtags are going to be deleted.",
                [
                  { text: "Dismiss", onPress: () => {} },
                  {
                    text: "Confirm",
                    style: "destructive",
                    onPress: () => flushDatabase(),
                  },
                ]
              )
            }
            title="Erase all my data"
            color="destructive"
          />
          <Title text="About" />
          <Button
            title="Source"
            onPress={() => Linking.openURL("https://github.com/meo-app/meo")}
          />
          <ThemeSection />
          {isDeveloper && (
            <>
              <Title text="Developer Options" />
              <Button
                title={`Create ${DUMMY_POSTS_SIZE} dummy posts`}
                onPress={() => createDummyPosts()}
              />
              <Button
                title="Reset onboarding flow"
                onPress={() => flushOnboarding()}
              />
            </>
          )}
        </ScrollView>
      </Frame>
    </Frame>
  );
}

const Title = React.memo<{ text: string }>(function Title({ text }) {
  const { paddingHorizontal } = usePaddingHorizontal();
  return (
    <Font
      variant="caption"
      marginTop="large"
      marginBottom="medium"
      color="foregroundSecondary"
      paddingHorizontal={paddingHorizontal}
      style={{
        textTransform: "uppercase",
      }}
    >
      {text}
    </Font>
  );
});

const Button = React.memo<{
  title: string;
  onPress: () => void;
  color?: keyof Colors;
}>(function Button({ title, onPress, color = "primary", children }) {
  const styles = useRowStyles();
  return (
    <Pressable onPress={onPress} style={styles}>
      <Font color={color}>{title}</Font>
      {children}
    </Pressable>
  );
});

interface ThemeSectionFieldValues {
  scheme: PreferredColorSchemeTypes;
}

const ThemeSection = React.memo(function Themeing() {
  const row = useRowStyles();
  const { control, setValue } = useForm<ThemeSectionFieldValues>();
  const queryClient = useQueryClient();

  const values = useWatch({
    control,
  });

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

  const theme = useTheme();

  return (
    <>
      <Title text="Theming" />
      <Controller<ThemeSectionFieldValues>
        name="scheme"
        control={control}
        render={({ field: { onChange } }) => (
          <Pressable style={row} onPress={() => onChange("system")}>
            <Font color="primary">Use System Light/Dark Mode</Font>
            <Frame
              style={{
                height: theme.scales.small,
              }}
            >
              {(values.scheme === "system" || !values.scheme) && (
                <Icon type="Check" size="small" color="primary" />
              )}
            </Frame>
          </Pressable>
        )}
      />
      <Controller<ThemeSectionFieldValues>
        name="scheme"
        control={control}
        render={({ field: { onChange } }) => (
          <Pressable style={row} onPress={() => onChange("dark")}>
            <Font color="primary">Dark</Font>

            <Frame
              style={{
                height: theme.scales.small,
              }}
            >
              {values.scheme === "dark" && (
                <Icon type="Check" size="small" color="primary" />
              )}
            </Frame>
          </Pressable>
        )}
      />
      <Controller<ThemeSectionFieldValues>
        name="scheme"
        control={control}
        render={({ field: { onChange } }) => (
          <Pressable style={row} onPress={() => onChange("light")}>
            <Font color="primary">Light</Font>
            <Frame
              style={{
                height: theme.scales.small,
              }}
            >
              {values.scheme === "light" && (
                <Icon type="Check" size="small" color="primary" />
              )}
            </Frame>
          </Pressable>
        )}
      />
    </>
  );
});

function useRowStyles() {
  const { paddingHorizontal } = usePaddingHorizontal();
  return useFrame({
    paddingHorizontal,
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: "large",
    backgroundColor: "background",
    justifyContent: "space-between",
  });
}

export { Settings };

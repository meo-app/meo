import { NavigationProp, useNavigation } from "@react-navigation/native";
import { LoremIpsum } from "lorem-ipsum";
import { transparentize } from "polished";
import React, { useMemo } from "react";
import { Alert, Linking, Modal, Pressable, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useMutation } from "react-query";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { SubtitleHeader } from "../components/SubtitleHeader";
import { Colors } from "../foundations/Colors";
import { useCreatePost } from "../hooks/use-create-post";
import { useFlushDatabase } from "../hooks/use-flush-database";
import { useSQLiteQuery } from "../hooks/use-sqlite-query";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
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
  const { data: developer } = useSQLiteQuery<{ total: number }>(
    QueryKeys.IS_DEVELOPER,
    `select count(*) as total from posts where value like "%${HOT_TO_GET_A_THOUSAND_SIMOLEONS}%" collate nocase`
  );

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
      <SubtitleHeader title="Settings" />
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
            title="Check the source on Github"
            onPress={() => Linking.openURL("https://github.com/meo-app/meo")}
          />
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
}>(function Button({ title, onPress, color = "primary" }) {
  const { paddingHorizontal } = usePaddingHorizontal();
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          paddingTop: theme.units.medium,
          paddingBottom: theme.units.medium,
          backgroundColor: theme.colors.background,
          paddingHorizontal,
        },
      }),
    [paddingHorizontal, theme.colors.background, theme.units.medium]
  );
  return (
    <Pressable onPress={onPress} style={styles.root}>
      <Font color={color}>{title}</Font>
    </Pressable>
  );
});

export { Settings };

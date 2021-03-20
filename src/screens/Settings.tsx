import { LoremIpsum } from "lorem-ipsum";
import React from "react";
import { Pressable } from "react-native";
import { useMutation } from "react-query";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { SubtitleHeader } from "../components/SubtitleHeader";
import { useCreatePost } from "../hooks/use-create-post";
import { useFlushDatabase } from "../hooks/use-flush-database";
import { useStyles } from "../hooks/use-styles";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
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

function useCreatDummyPosts(times: number = 100) {
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

function Settings() {
  const theme = useTheme();
  const { mutate: flushOnboarding } = useFlushOnboarding();
  const { mutate: flushDatabase } = useFlushDatabase();
  const { mutate: createDummyPosts } = useCreatDummyPosts();
  const { paddingHorizontal } = usePaddingHorizontal();
  const styles = useStyles(() => ({
    pressable: {
      paddingTop: theme.units.medium,
      paddingBottom: theme.units.medium,
      paddingHorizontal,
    },
  }));

  return (
    <Frame style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SubtitleHeader title="Settings" />
      <Pressable onPress={() => flushOnboarding()} style={styles.pressable}>
        <Font color="primary">Flush onboarding</Font>
      </Pressable>
      <Pressable onPress={() => flushDatabase()} style={styles.pressable}>
        <Font color="primary">Flush database</Font>
      </Pressable>
      <Pressable onPress={() => createDummyPosts()} style={styles.pressable}>
        <Font color="primary">Add 100 posts</Font>
      </Pressable>
    </Frame>
  );
}

export { Settings };

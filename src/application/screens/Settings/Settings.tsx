import { createStackNavigator } from "@react-navigation/stack";
import { LoremIpsum } from "lorem-ipsum";
import React from "react";
import { Pressable } from "react-native";
import { useMutation } from "react-query";
import { Font } from "../../../components/Font";
import { Frame } from "../../../components/Frame";
import { SubtitleHeader } from "../../../components/SubtitleHeader";
import { useCreatePost } from "../../../hooks/use-create-post";
import { useFlushDatabase } from "../../../hooks/use-flush-database";
import { useStyles } from "../../../hooks/use-styles";
import { useFlushOnboarding } from "../../../storage/onboarding";
import { useEdgeSpacing, useTheme } from "../../providers/Theming";
import { SettingsStackRoutes } from "./settings-stack-routes";

const Stack = createStackNavigator();

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
  const flushDatabase = useFlushDatabase();
  const edges = useEdgeSpacing();
  const styles = useStyles(() => ({
    pressable: {
      paddingTop: theme.units.medium,
      paddingBottom: theme.units.medium,
      paddingLeft: theme.units[edges.vertical],
      paddingRight: theme.units[edges.vertical],
    },
  }));

  const { mutate, isLoading } = useCreatDummyPosts();
  return (
    <Frame
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <SubtitleHeader title="Settings" />
      <Pressable onPress={() => flushOnboarding()} style={styles.pressable}>
        <Font color="primary">Flush onboarding</Font>
      </Pressable>
      <Pressable onPress={() => flushDatabase()} style={styles.pressable}>
        <Font color="primary">Flush database</Font>
      </Pressable>
      <Pressable onPress={() => mutate()} style={styles.pressable}>
        <Font color="primary">Add 100 posts {isLoading && "loading..."}</Font>
      </Pressable>
    </Frame>
  );
}

function Root() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={SettingsStackRoutes.Settings} component={Settings} />
    </Stack.Navigator>
  );
}

export { Root as Settings };

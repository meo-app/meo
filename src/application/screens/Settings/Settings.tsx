import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useCallback } from "react";
import { Pressable } from "react-native";
import { useFlushOnboarding } from "../../../api/onboarding";
import { useCreatePost } from "../../../api/useCreatePost";
import { useFlushDatabase } from "../../../api/useFlushDatabase";
import { Font } from "../../../components/Font";
import { Frame } from "../../../components/Frame";
import { SubtitleHeader } from "../../../components/SubtitleHeader";
import { useStyles } from "../../../hooks/use-styles";
import { RootStackRoutes } from "../../../root-stack-routes";
import { useEdgeSpacing, useTheme } from "../../providers/Theming";
import { AvatarContextProvider, AvatarSelection } from "../AvatarSelection";
import { SettingsStackRoutes } from "./settings-stack-routes";
import { LoremIpsum } from "lorem-ipsum";
import { useMutation } from "react-query";

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
            text,
          })
        )
    )
  );
}

function Settings() {
  const navigation = useNavigation();
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
      <Pressable
        style={styles.pressable}
        onPress={() => navigation.navigate(SettingsStackRoutes.AvatarSelection)}
      >
        <Font color="primary">Select avatar</Font>
      </Pressable>
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
  const navigation = useNavigation();
  return (
    <AvatarContextProvider
      onSuccess={() => {
        navigation.navigate(RootStackRoutes.Home);
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name={SettingsStackRoutes.Settings}
          component={Settings}
        />
        <Stack.Screen
          name={SettingsStackRoutes.AvatarSelection}
          component={AvatarSelection}
        />
      </Stack.Navigator>
    </AvatarContextProvider>
  );
}

export { Root as Settings };

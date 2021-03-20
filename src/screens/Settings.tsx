import { NavigationProp, useNavigation } from "@react-navigation/native";
import { LoremIpsum } from "lorem-ipsum";
import { transparentize } from "polished";
import React from "react";
import { Alert, Modal, Pressable, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useMutation } from "react-query";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { SubtitleHeader } from "../components/SubtitleHeader";
import { Colors } from "../foundations/Colors";
import { useCreatePost } from "../hooks/use-create-post";
import { useFlushDatabase } from "../hooks/use-flush-database";
import { useStyles } from "../hooks/use-styles";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";
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

function Settings() {
  const theme = useTheme();
  const { navigate } = useNavigation<NavigationProp<NavigationParamsConfig>>();
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
        <ScrollView
          contentContainerStyle={{
            paddingTop: theme.units.large,
          }}
        >
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
                  {
                    text: "Confirm",
                    style: "destructive",
                    onPress: () => flushDatabase(),
                  },
                  { text: "Dismiss", onPress: () => {} },
                ]
              )
            }
            title="Erase all my data"
            color="destructive"
          />
          <Font
            textAlign="center"
            paddingHorizontal="larger"
            variant="subtitle"
            marginTop="large"
            marginBottom="medium"
          >
            Developer options
          </Font>
          <Button
            title={`Create ${DUMMY_POSTS_SIZE} dummy posts`}
            onPress={() => createDummyPosts()}
          />
          <Button
            title="Reset onboarding flow"
            onPress={() => flushOnboarding()}
          />
        </ScrollView>
      </Frame>
    </Frame>
  );
}

const Button = React.memo<{
  title: string;
  onPress: () => void;
  color?: keyof Colors;
}>(function Button({ title, onPress, color = "primary" }) {
  const { paddingHorizontal } = usePaddingHorizontal();
  const styles = useStyles((theme) => ({
    root: {
      paddingTop: theme.units.medium,
      paddingBottom: theme.units.medium,
      backgroundColor: theme.colors.background,
      paddingHorizontal,
      borderColor: transparentize(0.5, theme.colors.foregroundSecondary),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderTopWidth: StyleSheet.hairlineWidth,
      marginBottom: theme.units.medium,
    },
  }));
  return (
    <Pressable onPress={onPress} style={styles.root}>
      <Font color={color}>{title}</Font>
    </Pressable>
  );
});

export { Settings };

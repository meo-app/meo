import {
  EventListenerCallback,
  EventMapCore,
  NavigationState,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useKeyboard } from "@react-native-community/hooks";
import { FormattedTime } from "react-intl";
import { Alert, Pressable, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import Share from "react-native-share";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { Icon } from "../components/Icon/Icon";
import { PostTextContent } from "../components/PostTextContent";
import { SubtitleHeader } from "../components/SubtitleHeader";
import { useDeletePost } from "../hooks/use-delete-post";
import { useEditPost } from "../hooks/use-edit-post";
import { useStyles } from "../hooks/use-styles";
import { useSQLiteQuery } from "../hooks/use-sqlite-query";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";
import { timestampToDate } from "../shared/date-utils";
import { QueryKeys } from "../shared/QueryKeys";
import { Post } from "../shared/SQLiteEntities";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { useDebounceValue } from "../hooks/use-debounce-value";

const PostDetails = React.memo(function PostDetails() {
  const {
    params: { id },
  } = useRoute<RouteProp<NavigationParamsConfig, "PostDetails">>();
  const hasFilledState = useRef(false);
  const keyboard = useKeyboard();
  const navigation = useNavigation();
  const theme = useTheme();
  const { paddingHorizontal } = usePaddingHorizontal();
  const input = useRef<TextInput>(null);
  const [editable, setEditable] = useState(false);
  const [text, onChangeText] = useState("");
  const changes = useDebounceValue(text, { delay: 1200 });
  const { mutate: editPost } = useEditPost({ id }, {});

  const { data } = useSQLiteQuery<Post>(
    [QueryKeys.POST_DETAILS, id],
    `select * from posts where id = ${id}`
  );

  const { mutate: deletePost } = useDeletePost({
    onSuccess: () => {
      navigation.goBack();
    },
  });

  const post = data?.[0];
  const date = useMemo(
    () => (post?.timestamp ? timestampToDate(post?.timestamp) : ""),
    [post]
  );

  useEffect(() => {
    if (!text && post?.value && !hasFilledState.current) {
      hasFilledState.current = true;
      onChangeText(post.value);
    }
  }, [post?.value, text]);

  const onDeletePress = useCallback(() => {
    Alert.alert("Delete post", "This action cannot be undone. Are you sure?", [
      { text: "Cancel", style: "cancel", onPress: () => {} },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deletePost({
            id,
          }),
      },
    ]);
  }, [deletePost, id]);

  useEffect(() => {
    const listener: EventListenerCallback<
      EventMapCore<NavigationState>,
      "beforeRemove"
    > = () => {
      if (text) {
        editPost({
          id,
          text,
        });
      }
    };

    navigation.addListener("beforeRemove", listener);
    return () => navigation.removeListener("beforeRemove", listener);
  }, [editPost, id, navigation, text]);

  const styles = useStyles(() => ({
    pressable: {
      padding: theme.units.medium,
    },
  }));

  useEffect(() => {
    if (editable) {
      input.current?.focus();
    }
  }, [editable]);

  useEffect(() => {
    if (changes) {
      editPost({
        id,
        text: changes,
      });
    }
  }, [changes, editPost, id]);

  return (
    <>
      <SubtitleHeader icon="Close">
        <Frame alignItems="flex-end">
          <Pressable>
            <Font
              variant="body"
              color="primary"
              onPress={() => {
                if (!editable) {
                  setEditable(true);
                } else {
                  input.current?.blur();
                }
              }}
            >
              {editable ? "Save" : "Edit"}
            </Font>
          </Pressable>
        </Frame>
      </SubtitleHeader>
      <SafeAreaView
        edges={["right", "bottom", "left"]}
        style={{
          paddingHorizontal,
          flex: 1,
        }}
      >
        <KeyboardAwareScrollView
          extraHeight={keyboard.keyboardHeight}
          enableAutomaticScroll
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: theme.units.medium,
          }}
        >
          <Frame>
            <TextInput
              ref={input}
              editable={editable}
              autoFocus
              placeholder="Write something"
              placeholderTextColor={theme.colors.foregroundSecondary}
              onChangeText={onChangeText}
              onBlur={() => setEditable(false)}
              multiline
              style={{
                ...(theme.typography.highlight as Object),
                width: "100%",
              }}
            >
              <PostTextContent
                variant="highlight"
                value={text}
                color="foregroundPrimary"
              />
            </TextInput>
          </Frame>
          <Frame
            paddingRight="medium"
            flexDirection="row"
            alignItems="center"
            marginTop="medium"
            marginBottom="medium"
          >
            <Font variant="caption" color="foregroundSecondary">
              <FormattedTime
                value={date}
                hour="numeric"
                minute="numeric"
                month="short"
                day="2-digit"
                year="numeric"
              />
            </Font>
          </Frame>
          <Frame
            justifyContent="space-between"
            flexDirection="row"
            paddingRight="larger"
            paddingLeft="larger"
            style={{
              borderBottomWidth: 0.5,
              borderTopWidth: 0.5,
              borderBottomColor: theme.colors.backgroundAccent,
              borderTopColor: theme.colors.backgroundAccent,
            }}
          >
            <Pressable
              style={styles.pressable}
              onPress={() =>
                Alert.alert("This feature is not ready", "Coming soon 😉")
              }
            >
              <Icon type="Reply" size="small" color="foregroundSecondary" />
            </Pressable>
            <Pressable onPress={() => onDeletePress()} style={styles.pressable}>
              <Icon type="Trash" size="small" color="foregroundSecondary" />
            </Pressable>
            <Pressable
              style={styles.pressable}
              onPress={() =>
                Share.open({
                  message: post?.value,
                })
              }
            >
              <Icon type="Share" size="small" color="foregroundSecondary" />
            </Pressable>
          </Frame>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
});

export { PostDetails };

import { useKeyboard } from "@react-native-community/hooks";
import {
  EventListenerCallback,
  EventMapCore,
  NavigationProp,
  NavigationState,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FormattedTime } from "react-intl";
import { Alert, Keyboard, Pressable, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import Share from "react-native-share";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { Icon } from "../components/Icon/Icon";
import { PostTextContent } from "../components/PostTextContent";
import { SubtitleHeader } from "../components/SubtitleHeader";
import { useDebounceValue } from "../hooks/use-debounce-value";
import { useDeletePost } from "../hooks/use-delete-post";
import { useDeletePostAlert } from "../hooks/use-delete-post-alert";
import { useEditPost } from "../hooks/use-edit-post";
import { useInvalidatePosts } from "../hooks/use-invalidate-posts";
import { usePostActionSheet } from "../hooks/use-post-action-sheet";
import { useSQLiteQuery } from "../hooks/use-sqlite-query";
import { useStyles } from "../hooks/use-styles";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { timestampToDate } from "../shared/date-utils";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";
import { QueryKeys } from "../shared/QueryKeys";
import { Post } from "../shared/SQLiteEntities";

const PostDetails = React.memo(function PostDetails() {
  const {
    params: { id, editPostEnabled },
  } = useRoute<RouteProp<NavigationParamsConfig, "PostDetails">>();
  const { setParams } = useNavigation<
    NavigationProp<NavigationParamsConfig, "PostDetails">
  >();

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

  const post = data?.[0];
  const date = useMemo(
    () => (post?.timestamp ? timestampToDate(post?.timestamp) : ""),
    [post]
  );
  const { showPostActionSheet } = usePostActionSheet({
    id,
    value: post?.value || "",
    deleteMutationOptions: {
      onSuccess: () => navigation.goBack(),
    },
  });

  useEffect(() => {
    if (editPostEnabled) {
      setEditable(true);
      setParams({ editPostEnabled: false });
    }
  }, [editPostEnabled, setParams]);

  useEffect(() => {
    if (!text && post?.value && !hasFilledState.current) {
      hasFilledState.current = true;
      onChangeText(post.value);
    }
  }, [post?.value, text]);

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
      <SubtitleHeader icon="Back">
        <Frame
          justifyContent="flex-end"
          flexDirection="row"
          alignItems="center"
        >
          <Pressable
            onPress={() => {
              setEditable(false);
              showPostActionSheet();
            }}
            hitSlop={theme.units.large}
          >
            <Icon type="More" size="medium" color="primary" />
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
            paddingRight="large"
            paddingLeft="large"
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
              <Icon type="Reply" size="smaller" color="foregroundSecondary" />
            </Pressable>
            <Pressable
              style={styles.pressable}
              onPress={() =>
                Share.open({
                  message: post?.value,
                })
              }
            >
              <Icon type="Share" size="smaller" color="foregroundSecondary" />
            </Pressable>
          </Frame>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
});

export { PostDetails };

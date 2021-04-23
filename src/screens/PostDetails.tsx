import {
  EventListenerCallback,
  EventMapCore,
  NavigationState,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FormattedTime } from "react-intl";
import { Pressable, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { Icon } from "../components/Icon/Icon";
import { PostInputAccessory } from "../components/PostInputAccessory";
import { PostTextContent } from "../components/PostTextContent";
import { SubtitleHeader } from "../components/SubtitleHeader";
import { useDebounceValue } from "../hooks/use-debounce-value";
import { useEditPost } from "../hooks/use-edit-post";
import { usePostActionSheet } from "../hooks/use-post-action-sheet";
import { useSQLiteQuery } from "../hooks/use-sqlite-query";
import { useTextCaretWord } from "../hooks/use-text-caret-word";
import { usePaddingHorizontal, useTheme } from "../providers/Theming";
import { timestampToDate } from "../shared/date-utils";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";
import { QueryKeys } from "../shared/QueryKeys";
import { Post } from "../shared/SQLiteEntities";

const PostDetails = React.memo(function PostDetails() {
  const {
    params: { id },
  } = useRoute<RouteProp<NavigationParamsConfig, "PostDetails">>();

  const [focus, setFocus] = useState(false);
  const hasFilledState = useRef(false);
  const navigation = useNavigation();
  const theme = useTheme();
  const { paddingHorizontal } = usePaddingHorizontal();
  const [text, changeText] = useState("");
  const changes = useDebounceValue(text, { delay: 1200 });
  const { mutate: editPost } = useEditPost({ id }, {});
  const { data, isLoading } = useSQLiteQuery<Post & { date: string }>({
    queryKey: [QueryKeys.POST_DETAILS, id],
    query: `select *, datetime(timestamp, 'localtime') as date from posts where id = ${id}`,
  });

  const post = data?.[0];
  const date = useMemo(
    () => (post?.timestamp ? timestampToDate(post?.date) : ""),
    [post]
  );
  const { showPostActionSheet } = usePostActionSheet({
    id,
    value: post?.value || "",
    deleteMutationOptions: {
      onSuccess: () => navigation.goBack(),
    },
  });

  const { caretWord, onSelectionChange } = useTextCaretWord({
    text,
  });

  useEffect(() => {
    if (!text && post?.value && !hasFilledState.current) {
      hasFilledState.current = true;
      changeText(post.value);
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

  useEffect(() => {
    if (changes) {
      editPost({
        id,
        text: changes,
      });
    }
  }, [changes, editPost, id]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <SubtitleHeader icon="Back">
        <Frame
          justifyContent="flex-end"
          flexDirection="row"
          alignItems="center"
        >
          <Pressable
            onPress={() => showPostActionSheet()}
            hitSlop={theme.units.large}
          >
            <Icon type="More" size="medium" color="primary" />
          </Pressable>
        </Frame>
      </SubtitleHeader>
      <Frame
        paddingRight="medium"
        flexDirection="row"
        alignItems="center"
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
      <Frame debugTrace flex={1}>
        {/* <TextInput
          editable
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder="Write something"
          placeholderTextColor={theme.colors.foregroundSecondary}
          onChangeText={(text) => changeText(text)}
          onSelectionChange={onSelectionChange}
          scrollEnabled
          multiline
          style={{
            ...(theme.typography.highlight as Object),
            textAlignVertical: "top",
            flex: 1,
            width: "100%",
          }}
        >
          <PostTextContent
            variant="highlight"
            value={text}
            color="foregroundPrimary"
          />
        </TextInput> */}
        <TextInput
          // ref={ref}
          placeholder="Write something"
          placeholderTextColor={theme.colors.foregroundSecondary}
          onChangeText={(text) => changeText(text)}
          multiline
          onSelectionChange={onSelectionChange}
          scrollEnabled
          style={{
            ...(theme.typography.highlight as Object),
            flex: 1,
            textAlignVertical: "top",
            marginTop: theme.units.medium,
            paddingBottom: theme.units.medium,
            paddingLeft: theme.units.medium,
            // width: dimensions.width * 0.7,
          }}
        >
          <PostTextContent value={text} variant="highlight" />
        </TextInput>
      </Frame>
      {/* {focus && (
        <PostInputAccessory
          text={text}
          caretWord={caretWord}
          onHashtagSelected={(text) => changeText(text)}
        />
      )} */}
    </>
  );
});

export { PostDetails };

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
import { Pressable } from "react-native";
import { Font } from "../components/Font";
import { Frame } from "../components/Frame";
import { Icon } from "../components/Icon/Icon";
import { PostLayout } from "../layouts/PostLayout";
import { useDebounceValue } from "../hooks/use-debounce-value";
import { useEditPost } from "../hooks/use-edit-post";
import { usePostActionSheet } from "../hooks/use-post-action-sheet";
import { useSQLiteQuery } from "../hooks/use-sqlite-query";
import { useTheme } from "../providers/Theming/Theming";
import { timestampToDate } from "../shared/date-utils";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";
import { QueryKeys } from "../shared/QueryKeys";
import { Post } from "../shared/SQLiteEntities";
import { usePaddingHorizontal } from "../providers/Theming/hooks/use-padding-horizontal";

const PostDetails = React.memo(function PostDetails() {
  const {
    params: { id },
  } = useRoute<RouteProp<NavigationParamsConfig, "PostDetails">>();

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
    <PostLayout
      text={text}
      changeText={changeText}
      beforeTextContent={
        <Frame
          paddingRight="medium"
          flexDirection="row"
          alignItems="center"
          marginTop="small"
          paddingHorizontal={paddingHorizontal}
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
      }
      navigationHeaderChildren={
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
      }
    />
  );
});

export { PostDetails };

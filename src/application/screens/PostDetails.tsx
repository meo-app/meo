import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";
import { FormattedTime } from "react-intl";
import { Alert, Pressable } from "react-native";
import Share from "react-native-share";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "react-query";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Icon } from "../../components/Icon/Icon";
import { PostTextContent } from "../../components/PostTextContent";
import { SubtitleHeader } from "../../components/SubtitleHeader";
import { useSqliteMutation } from "../../hooks/use-sqlite-mutation";
import { useStyles } from "../../hooks/use-styles";
import { useTransaction } from "../../hooks/use-transaction";
import { RootStackParamList } from "../../root-stack-routes";
import { QueryKeys } from "../../shared/QueryKeys";
import { Post } from "../../shared/SQLiteEntities";
import { timestampToDate } from "../../utils/timestamp-to-date";
import { useEdgeSpacing, useTheme } from "../providers/Theming";

function useDeletePost() {
  const client = useQueryClient();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { mutateAsync: deletePost } = useSqliteMutation<{ id: string }>({
    mapVariables: ({ id }) => [id],
    mutation: "delete from posts where id = (?);",
  });

  const { mutateAsync: deleteHashtag } = useSqliteMutation<{ id: string }>({
    mapVariables: ({ id }) => [id],
    mutation: "delete from hashtags where post_id = (?);",
    options: {
      onSuccess: () => {
        client.invalidateQueries([QueryKeys.POSTS]);
        client.invalidateQueries([QueryKeys.HASHTAG_VIEWER]);
        client.invalidateQueries([QueryKeys.SEARCH]);
        client.invalidateQueries([QueryKeys.TOP_HASHTAGS]);
        navigation.goBack();
      },
    },
  });

  const mutateAsync = useCallback(
    ({ id }: { id: string }) =>
      Promise.all([deletePost({ id }), deleteHashtag({ id })]),
    [deleteHashtag, deletePost]
  );

  return {
    mutateAsync,
  };
}

const PostDetails = React.memo(function PostDetails() {
  const {
    params: { id },
  } = useRoute<RouteProp<RootStackParamList, "PostDetails">>();
  const theme = useTheme();
  const spacing = useEdgeSpacing(); // TODO: refactor useEdgeSpacing to useHorizontalPadding
  const { mutateAsync: deletePostAsync } = useDeletePost();
  const { data } = useTransaction<Post>(
    [QueryKeys.POST_DETAILS, id],
    `select * from posts where id = ${id}`
  );

  const post = data?.[0];
  const date = useMemo(
    () => (post?.timestamp ? timestampToDate(post?.timestamp) : ""),
    [post]
  );

  const onDeletePress = useCallback(() => {
    Alert.alert("Delete post", "This action cannot be undone. Are you sure?", [
      { text: "Cancel", style: "cancel", onPress: () => {} },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deletePostAsync({
            id,
          }),
      },
    ]);
  }, [deletePostAsync, id]);

  const styles = useStyles(() => ({
    pressable: {
      padding: theme.units.medium,
    },
  }));

  return (
    <>
      <SubtitleHeader icon="Close" />
      <SafeAreaView
        edges={["right", "bottom", "left"]}
        style={{
          paddingHorizontal: theme.units[spacing.horizontal],
          flex: 1,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: theme.units[spacing.vertical],
          }}
        >
          <Frame>
            <PostTextContent
              variant="highlight"
              value={String(post?.value)}
              color="foregroundPrimary"
            />
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
            style={{
              borderBottomWidth: 0.5,
              borderTopWidth: 0.5,
              borderBottomColor: theme.colors.backgroundAccent,
              borderTopColor: theme.colors.backgroundAccent,
              paddingRight: theme.units.larger,
              paddingLeft: theme.units.larger,
            }}
          >
            <Pressable onPress={() => onDeletePress()} style={styles.pressable}>
              <Icon type="Trash" size="small" color="foregroundSecondary" />
            </Pressable>
            <Pressable onPress={() => {}} style={styles.pressable}>
              <Icon type="Edit" size="small" color="foregroundSecondary" />
            </Pressable>
            <Pressable
              onPress={() =>
                Share.open({
                  message: post?.value,
                })
              }
              style={styles.pressable}
            >
              <Icon type="Share" size="small" color="foregroundSecondary" />
            </Pressable>
          </Frame>
        </ScrollView>
      </SafeAreaView>
    </>
  );
});

export { PostDetails };

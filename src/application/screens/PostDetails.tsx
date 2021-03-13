import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
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
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Icon } from "../../components/Icon/Icon";
import { PostTextContent } from "../../components/PostTextContent";
import { SubtitleHeader } from "../../components/SubtitleHeader";
import { useDeletePost } from "../../hooks/use-delete-post";
import { useEditPost } from "../../hooks/use-edit-post";
import { useStyles } from "../../hooks/use-styles";
import { useTransaction } from "../../hooks/use-transaction";
import { RootStackParamList } from "../../root-stack-routes";
import { timestampToDate } from "../../shared/date-utils";
import { QueryKeys } from "../../shared/QueryKeys";
import { Post } from "../../shared/SQLiteEntities";
import { useEdgeSpacing, useTheme } from "../providers/Theming";

const PostDetails = React.memo(function PostDetails() {
  const {
    params: { id },
  } = useRoute<RouteProp<RootStackParamList, "PostDetails">>();
  const keyboard = useKeyboard();
  console.log(JSON.stringify(keyboard, null, 2));
  const navigation = useNavigation();
  const theme = useTheme();
  const spacing = useEdgeSpacing(); // TODO: refactor useEdgeSpacing to useHorizontalPadding
  const input = useRef<TextInput>(null);
  const [editable, setEditable] = useState(false);
  const [text, onChangeText] = useState("");
  const { mutate: editPost } = useEditPost(
    { id },
    {
      onSuccess: () => input.current?.blur(),
    }
  );
  const { data } = useTransaction<Post>(
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
                  // TODO: only if has changes
                  editPost({
                    id,
                    text,
                  });
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
          paddingHorizontal: theme.units[spacing.horizontal],
          flex: 1,
        }}
      >
        <KeyboardAwareScrollView
          extraHeight={keyboard.keyboardHeight}
          enableAutomaticScroll
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: theme.units[spacing.vertical],
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
                ...(theme.typography.body as Object),
                width: "100%",
              }}
            >
              <PostTextContent
                variant="highlight"
                value={text || String(post?.value)}
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

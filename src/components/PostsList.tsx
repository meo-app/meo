import { Post } from "../api/Entities";
import { StyleSheet, Alert } from "react-native";
import { Frame } from "./Frame";
import {
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native-gesture-handler";
import { useTheme, useEdgeSpacing } from "../application/providers/Theming";
import { usePostsFlatList } from "../application/providers/HomeProvider";
import { useCallback, useEffect } from "react";
import React from "react";
import { Picture } from "./Picture";
import { Font } from "./Font";
import { FormattedDate } from "react-intl";
import { timestampToDate } from "../utils/timestamp-to-date";
import { ListRenderItem } from "react-native";
import FastImage from "react-native-fast-image";
import { opacify, lighten } from "polished";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { RouteNames } from "../route-names";

function PostsList({ data }: { data?: Post[] }) {
  const theme = useTheme();
  const { postsRef } = usePostsFlatList();
  useEffect(() => {
    FastImage.preload([
      {
        uri: "https://i.pravatar.cc/150",
      },
    ]);
  }, []);
  const keyExtractor = useCallback(
    ({ id }: { id: string }) => `list-item-${id}`,
    []
  );

  const renderItem = useCallback<ListRenderItem<Post>>(
    ({ item, index }) => {
      // TODO: conditional wrap
      // TODO: fix this in search and home
      if (data && index === data.length - 1) {
        return (
          <Frame
            style={{
              paddingBottom: theme.units.largest * 3.5,
            }}
          >
            <PostLine {...item} />
          </Frame>
        );
      }

      return <PostLine {...item} />;
    },
    [data, theme.units.largest]
  );

  if (!Boolean(data?.length)) {
    return null;
  }
  return (
    <FlatList<Post>
      style={{
        height: "100%",
        backgroundColor: theme.colors.background,
      }}
      ref={postsRef}
      keyExtractor={keyExtractor}
      data={data}
      renderItem={renderItem}
    />
  );
}

const regex = /(\#\w+)/g;
const PostLine = React.memo(function PostLine({ id, value, timestamp }: Post) {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <Frame
      paddingBottom="medium"
      paddingRight={spacing.horizontal}
      paddingLeft={spacing.horizontal}
    >
      <Frame
        marginTop={spacing.vertical}
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
      >
        <Frame
          flexDirection="row"
          alignItems="baseline"
          style={{
            height: "100%",
          }}
        >
          <Picture
            style={{
              borderRadius: theme.constants.borderRadius,
            }}
            lazyload={false}
            key={`picture-${id}`}
            width={theme.scales.larger}
            aspectRatio="square"
            resizeMode="cover"
            source="https://i.pravatar.cc/150"
          />
        </Frame>
        <Frame flexGrow={1} flex={1} paddingLeft="small">
          <Font numberOfLines={5}>
            {/* TODO: split into a different component and handle touch + bring to search */}
            {value.split(regex).map((item, index) => {
              if (/\#/.test(item)) {
                return (
                  <Font
                    color="primary"
                    key={`hashtag-${index}-${item}`}
                    onPress={() => {
                      navigation.navigate(RouteNames.Search, {
                        hashtag: item,
                      });
                    }}
                  >
                    {item}
                  </Font>
                );
              }

              return item;
            })}
          </Font>
        </Frame>
      </Frame>
      <Frame
        alignItems="flex-end"
        paddingTop="small"
        paddingRight={spacing.horizontal}
        paddingLeft={spacing.horizontal}
      >
        <Font variant="caption" color="foregroundSecondary">
          <FormattedDate
            value={timestampToDate(timestamp)}
            dateStyle="short"
            month="short"
            day="2-digit"
          />
        </Font>
      </Frame>
    </Frame>
  );
});

export { PostsList };

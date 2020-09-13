import { createStackNavigator } from "@react-navigation/stack";
import React, { useRef, useCallback } from "react";
import { FlatList, Image, View } from "react-native";
import { Post } from "../../api/Entities";
import { usePosts } from "../../api/usePosts";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { RouteNames } from "../../route-names";
import { useEdgeSpacing, useTheme } from "../providers/Theming";
import { FormattedDate } from "react-intl";
import { timestampToDate } from "../../utils/timestamp-to-date";
import { Picture } from "../../components/Picture";
import { usePostsFlatList } from "../providers/HomeProvider";
import { useIsFocused } from "@react-navigation/native";

const Stack = createStackNavigator();

function Home() {
  const { data, error, isFetching } = usePosts();
  const theme = useTheme();
  const { postsRef } = usePostsFlatList();
  const keyExtractor = useCallback(
    ({ id }: { id: string }) => `list-item-${id}`,
    []
  );
  return (
    <View>
      {isFetching && (
        <View>
          <Font>TODO: loading state</Font>
        </View>
      )}
      {error && (
        <View>
          <Font>TODO: error state</Font>
        </View>
      )}
      {!Boolean(data?.length) && (
        <View>
          <Font>TODO: Empty view</Font>
        </View>
      )}
      {Boolean(data?.length) && (
        <Frame>
          <FlatList<Post>
            style={{
              height: "100%",
            }}
            ref={postsRef}
            keyExtractor={keyExtractor}
            data={data}
            renderItem={({ item, index }) =>
              data && index === data?.length - 1 ? (
                <Frame
                  style={{
                    paddingBottom: theme.units.largest * 3.5,
                  }}
                >
                  <PostLine {...item} />
                </Frame>
              ) : (
                <PostLine {...item} />
              )
            }
          />
        </Frame>
      )}
    </View>
  );
}

function Root() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: Header,
      }}
    >
      <Stack.Screen name={RouteNames.Home} component={Home} />
    </Stack.Navigator>
  );
}

const PostLine = React.memo(function PostLine({ value, timestamp }: Post) {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  return (
    <>
      <Frame
        marginTop={spacing.vertical}
        paddingRight={spacing.horizontal}
        paddingLeft={spacing.horizontal}
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
            width={theme.scales.larger}
            aspectRatio="square"
            resizeMode="cover"
            source="https://i.pravatar.cc/150"
          />
        </Frame>
        <Frame flexGrow={1} flex={1} paddingLeft="medium">
          <Font numberOfLines={5}>{value}</Font>
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
            month="long"
            year="numeric"
            day="2-digit"
          />
        </Font>
      </Frame>
    </>
  );
});

export { Root as Home };

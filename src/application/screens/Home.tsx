import React, { useRef } from "react";
import { FlatList, Image, View } from "react-native";
import { Post } from "../../api/Entities";
import { usePosts } from "../../api/usePosts";
import { FloatingActions } from "../../components/FloatingActions";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { useEdgeSpacing, useTheme } from "../providers/Theming";

function Home() {
  const { data, error, isFetching } = usePosts();
  const ref = useRef<FlatList>(null);
  return (
    <>
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
        {Boolean(data?.length) && (
          <Frame paddingBottom="largest">
            <FlatList
              style={{
                height: "100%",
              }}
              ref={ref}
              keyExtractor={({ id }) => `list-item-${id}`}
              data={data}
              renderItem={({ item }) => <PostLine {...item} />}
            />
          </Frame>
        )}
      </View>
      {/* <FloatingActions
        onScrollTopRequest={() => {
          ref.current?.scrollToIndex({
            animated: true,
            index: 0,
          });
        }}
      /> */}
    </>
  );
}

function PostLine({ value }: Post) {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  return (
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
        <Image
          style={{
            width: theme.scales.medium,
            height: theme.scales.medium,
            resizeMode: "cover",
            borderRadius: theme.constants.borderRadius,
          }}
          source={{
            uri: "https://i.pravatar.cc/150",
          }}
        />
      </Frame>
      <Frame flexGrow={1} flex={1} paddingLeft="medium">
        <Font numberOfLines={5}>{value}</Font>
      </Frame>
    </Frame>
  );
}

export { Home };

import { useNavigation, ThemeProvider } from "@react-navigation/native";
import React from "react";
import { Image, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { usePosts } from "../../api/usePosts";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { useEdgeSpacing, useTheme } from "../providers/Theming";
import { FloatingActions } from "../../components/FloatingActions";

function Home() {
  const { navigate } = useNavigation();
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const { data, error, isFetching } = usePosts();
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
        {/* TODO: flatlist */}
        {Boolean(data?.length) && (
          <ScrollView>
            {data?.map((post) => (
              <Frame
                key={post.id}
                marginTop={spacing.vertical}
                paddingRight={spacing.horizontal}
                paddingLeft={spacing.horizontal}
                justifyContent="flex-start"
                alignItems="center"
                flexDirection="row"
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
                <Frame flexGrow={1} paddingLeft="medium">
                  <Font>{post.value}</Font>
                </Frame>
              </Frame>
            ))}
          </ScrollView>
        )}
      </View>
      <FloatingActions />
    </>
  );
}

export { Home };

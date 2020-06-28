import { SafeStackArea } from "../../components/SafeStackArea";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useEdgeSpacing } from "../providers/Theming";
import { usePosts } from "../../api/usePosts";
import { View, Button } from "react-native";
import { Font } from "../../components/Font";
import { ScrollView } from "react-native-gesture-handler";
import { Frame } from "../../components/Frame";

function Home() {
  const { navigate } = useNavigation();
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const { data, error, isFetching } = usePosts();
  return (
    <SafeStackArea>
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
      <Button onPress={() => navigate("Create")} title="Create" />
    </SafeStackArea>
  );
}

export { Home };

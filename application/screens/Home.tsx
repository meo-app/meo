import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, View } from "react-native";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { usePosts } from "../../api/usePosts";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { SafeStackArea } from "../../components/SafeStackArea";
import { useEdgeSpacing, useTheme } from "../providers/Theming";
import { Plus } from "../icons/Plus";

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
      {/* TODO: Finish this, and move it somewhere else */}
      <Frame
        alignItems="baseline"
        justifyContent="space-evenly"
        style={{
          position: "absolute",
          left: theme.units[spacing.horizontal],
          right: theme.units[spacing.horizontal],
          bottom: 0,
          height: 110,
        }}
      >
        <LinearGradient
          colors={["transparent", theme.colors.background]}
          locations={[0.1, 0.7]}
          start={{
            y: 0.1,
            x: 0,
          }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 110,
          }}
        >
          <Frame
            alignItems="center"
            style={{
              marginBottom: -theme.scales.medium / 2,
              zIndex: 999,
            }}
          >
            <TouchableHighlight
              onPress={() => navigate("Create")}
              style={{
                width: theme.scales.medium,
                height: theme.scales.medium,
                backgroundColor: theme.colors.backgroundAccent,
                elevation: 2,
                borderRadius: 9999,
                position: "relative",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus />
            </TouchableHighlight>
          </Frame>
          <Frame
            flexDirection="row"
            justifyContent="space-between"
            style={{
              backgroundColor: theme.colors.backgroundAccent,
              height: 60,
              borderRadius: 999,
              elevation: 2,
              position: "relative",
            }}
          >
            <Frame flexGrow={1} alignItems="center" justifyContent="center">
              <Font variant="display" color="foregroundSecondary">
                A
              </Font>
            </Frame>
            <Frame flexGrow={1} alignItems="center" justifyContent="center">
              <Font variant="display" color="foregroundSecondary">
                B
              </Font>
            </Frame>
          </Frame>
        </LinearGradient>
      </Frame>
    </SafeStackArea>
  );
}

export { Home };

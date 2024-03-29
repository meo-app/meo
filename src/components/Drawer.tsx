import { NavigationProp } from "@react-navigation/native";
import React, { useMemo } from "react";
import { ImageBackground, Linking, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { version } from "../../package.json";
import { useSQLiteQuery } from "../hooks/use-sqlite-query";
import { usePaddingHorizontal } from "../providers/Theming/hooks/use-padding-horizontal";
import { useTheme } from "../providers/Theming/hooks/use-theme";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";
import { QueryKeys } from "../shared/QueryKeys";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { UserAvatar } from "./UserAvatar";

interface Props {
  navigation: NavigationProp<NavigationParamsConfig>;
}

const Drawer: React.VoidFunctionComponent<Props> = function Drawer({
  navigation,
}) {
  const { paddingHorizontal } = usePaddingHorizontal();
  const theme = useTheme();
  const { data: posts } = useSQLiteQuery<{ total: number }>({
    queryKey: QueryKeys.TOTAL_OF_POSTS,
    query: "select count(*) as total from posts",
  });

  const { data: tags } = useSQLiteQuery<{ total: number }>({
    queryKey: QueryKeys.TOTAL_OF_HASHTAGS,
    query:
      "select count(*) as total from (select distinct value from hashtags)",
  });

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../assets/bg-pattern-grayscale.png")}
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <SafeAreaView
        style={{
          paddingHorizontal,
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <Frame>
          <Frame alignItems="center" justifyContent="center" paddingTop="large">
            <Pressable onPress={() => navigation.navigate("ChangeAvatar")}>
              <Frame marginRight="medium" alignItems="center">
                <UserAvatar size={theme.scales.largest * 1.8} />
              </Frame>
            </Pressable>
            <Frame marginTop="large" flexDirection="row">
              <Frame
                alignItems="center"
                justifyContent="center"
                paddingLeft="large"
                paddingRight="large"
              >
                <Font variant="display">{posts?.[0]?.total}</Font>
                <Font variant="caption">posts</Font>
              </Frame>
              <Frame
                alignItems="center"
                justifyContent="center"
                paddingLeft="large"
                paddingRight="large"
              >
                <Font variant="display" color="primary">
                  {tags?.[0].total}
                </Font>
                <Font variant="caption">tags</Font>
              </Frame>
            </Frame>
          </Frame>
          <Frame marginTop="larger">
            <DrawerItem
              onPress={() => navigation.navigate("Settings")}
              text="Settings"
            />
            <DrawerItem
              text="Feedback"
              onPress={() =>
                Linking.openURL("https://airtable.com/shrkkB8aDPVb65Yrr")
              }
            />
            <DrawerItem
              text="About"
              onPress={() =>
                Linking.openURL("https://www.youtube.com/watch?v=sOS9aOIXPEk")
              }
            />
          </Frame>
        </Frame>
        <Frame alignItems="flex-end" paddingBottom="medium">
          <Font variant="caption">{version}</Font>
        </Frame>
      </SafeAreaView>
    </ImageBackground>
  );
};

const DrawerItem = React.memo(function DrawerItem({
  text,
  onPress,
}: {
  onPress: () => void;
  text: string;
}) {
  const theme = useTheme();
  const styles = useMemo(
    () => ({
      root: {
        padding: theme.units.medium,
        paddingLeft: 0,
      },
    }),
    [theme.units.medium]
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        ...styles.root,
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <Font color="foregroundPrimary" variant="subtitle">
        {text}
      </Font>
    </Pressable>
  );
});

export { Drawer };

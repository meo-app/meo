import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { Alert, ImageBackground, Linking, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteQuery } from "../hooks/use-sqlite-query";
import { useStyles } from "../hooks/use-styles";
import { usePaddingHorizontal } from "../providers/Theming";
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
  const styles = useStyles(() => ({
    root: {
      paddingHorizontal,
      flex: 1,
    },
  }));

  const { data: posts } = useSQLiteQuery<{ total: number }>(
    QueryKeys.TOTAL_OF_POSTS,
    "select count(*) as total from posts"
  );

  const { data: tags } = useSQLiteQuery<{ total: number }>(
    QueryKeys.TOTAL_OF_HASHTAGS,
    "select count(*) as total from (select distinct value from hashtags)"
  );

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../assets/bg-pattern-grayscale.png")}
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <SafeAreaView style={styles.root}>
        <Frame alignItems="center" justifyContent="center" paddingTop="large">
          <Pressable onPress={() => navigation.navigate("ChangeAvatar")}>
            <Frame marginRight="medium" alignItems="center">
              <UserAvatar size="largest" />
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
            onPress={() =>
              Alert.alert("Something About Us", "Daft Punk", [
                {
                  onPress: () =>
                    Linking.openURL(
                      "https://www.youtube.com/watch?v=sOS9aOIXPEk"
                    ),
                  style: "destructive",
                  text: "Nah",
                },
                {
                  onPress: () => {},
                  text: "Okay",
                },
              ])
            }
            text="About"
          />
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
  const styles = useStyles((theme) => ({
    root: {
      padding: theme.units.medium,
      paddingLeft: 0,
    },
  }));

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

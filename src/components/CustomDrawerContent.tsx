import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React from "react";
import { ImageBackground, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEdgeSpacing } from "../application/providers/Theming";
import { useStyles } from "../hooks/use-styles";
import { useTransaction } from "../hooks/use-transaction";
import { QueryKeys } from "../shared/QueryKeys";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { UserAvatar } from "./UserAvatar";
import { Linking } from "react-native";

interface Props extends DrawerContentComponentProps {}

const CustomDrawerContent: React.VoidFunctionComponent<Props> = function CustomDrawerContent({
  navigation,
}) {
  const spacing = useEdgeSpacing();
  const styles = useStyles((theme) => ({
    root: {
      paddingLeft: theme.units[spacing.horizontal],
      paddingRight: theme.units[spacing.horizontal],
      flex: 1,
    },
  }));

  const { data: posts } = useTransaction<{ total: number }>(
    QueryKeys.TOTAL_OF_POSTS,
    "select count(*) as total from posts"
  );

  const { data: tags } = useTransaction<{ total: number }>(
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
          <Pressable onPress={() => console.log("TODO: change avatar")}>
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
            onPress={() =>
              Linking.openURL("https://airtable.com/shrkkB8aDPVb65Yrr")
            }
            text="Feedback"
          />
          <DrawerItem onPress={() => {}} text="About" />
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

export { CustomDrawerContent };

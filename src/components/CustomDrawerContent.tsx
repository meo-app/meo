import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEdgeSpacing } from "../application/providers/Theming";
import { useStyles } from "../hooks/use-styles";
import { RootStackRoutes } from "../root-stack-routes";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { UserAvatar } from "./UserAvatar";

interface Props extends DrawerContentComponentProps {}

const CustomDrawerContent: React.VoidFunctionComponent<Props> = function CustomDrawerContent(
  props
) {
  const spacing = useEdgeSpacing();
  const styles = useStyles((theme) => ({
    root: {
      paddingLeft: theme.units[spacing.horizontal],
      paddingRight: theme.units[spacing.horizontal],
      flex: 1,
    },
    navigationItem: {
      padding: theme.units.medium,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.foregroundSecondary,
      paddingBottom: theme.units.small,
      paddingLeft: 0,
    },
  }));
  return (
    <SafeAreaView style={styles.root}>
      <Frame flexDirection="row" alignItems="center">
        <Frame marginRight="medium">
          <UserAvatar size="large" />
        </Frame>
        <Font>Claudio</Font>
      </Frame>
      <Frame marginTop="large">
        <Pressable
          style={({ pressed }) => ({
            ...styles.navigationItem,
            opacity: pressed ? 0.5 : 1,
          })}
          onPress={() => props.navigation.navigate(RootStackRoutes.Settings)}
        >
          <Font color="foregroundSecondary">Settings</Font>
        </Pressable>
      </Frame>
    </SafeAreaView>
  );
};

export { CustomDrawerContent };

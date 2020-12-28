import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { AvatarSelection } from "./AvatarSelection";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Pressable } from "react-native";
import { useTheme, useEdgeSpacing } from "../providers/Theming";
import { useFlushOnboarding } from "../../api/onboarding";
import { useStyles } from "../../hooks/use-styles";
import { useFlushDatabase } from "../../api/useFlushDatabase";

const Stack = createStackNavigator();

enum SettingsRouteNames {
  Settings = "Settings",
  AvatarSelection = "AvatarSelection",
}

function Settings() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { mutate: flushOnboarding } = useFlushOnboarding();
  const flushDatabase = useFlushDatabase();
  const edges = useEdgeSpacing();
  const styles = useStyles(() => ({
    pressable: {
      paddingTop: theme.units.medium,
      paddingBottom: theme.units.medium,
      paddingLeft: theme.units[edges.vertical],
      paddingRight: theme.units[edges.vertical],
    },
  }));
  return (
    <Frame
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <Pressable
        style={styles.pressable}
        onPress={() => navigation.navigate(SettingsRouteNames.AvatarSelection)}
      >
        <Font color="primary">Select avatar</Font>
      </Pressable>
      <Pressable onPress={() => flushOnboarding()} style={styles.pressable}>
        <Font color="primary">Flush onboarding</Font>
      </Pressable>
      <Pressable onPress={() => flushDatabase()} style={styles.pressable}>
        <Font color="primary">Flush database</Font>
      </Pressable>
    </Frame>
  );
}

function Root() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={SettingsRouteNames.Settings} component={Settings} />
      <Stack.Screen
        name={SettingsRouteNames.AvatarSelection}
        component={AvatarSelection}
      />
    </Stack.Navigator>
  );
}

export { Root as Settings };

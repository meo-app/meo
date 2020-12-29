import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Pressable } from "react-native";
import { useFlushOnboarding } from "../../../api/onboarding";
import { useFlushDatabase } from "../../../api/useFlushDatabase";
import { Font } from "../../../components/Font";
import { Frame } from "../../../components/Frame";
import { Header } from "../../../components/Header";
import { useStyles } from "../../../hooks/use-styles";
import { useEdgeSpacing, useTheme } from "../../providers/Theming";
import { AvatarSelection } from "../AvatarSelection";
import { SettingsStackRoutes } from "./settings-stack-routes";

const Stack = createStackNavigator();

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
        onPress={() => navigation.navigate(SettingsStackRoutes.AvatarSelection)}
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
      <Stack.Screen
        name={SettingsStackRoutes.Settings}
        component={Settings}
        options={{
          header: (props) => (
            <Header {...props} hideBackground>
              <Frame
                justifyContent="center"
                style={{
                  width: "100%",
                }}
              >
                <Font
                  variant="subtitle"
                  style={{
                    textAlign: "center",
                  }}
                >
                  Settings
                </Font>
              </Frame>
            </Header>
          ),
        }}
      />
      <Stack.Screen
        name={SettingsStackRoutes.AvatarSelection}
        component={AvatarSelection}
      />
    </Stack.Navigator>
  );
}

export { Root as Settings };

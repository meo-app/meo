import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { AvatarSelection } from "./AvatarSelection";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

const Stack = createStackNavigator();

enum SettingsRouteNames {
  Settings = "Settings",
  AvatarSelection = "AvatarSelection",
}

function Settings() {
  const navigation = useNavigation();
  return (
    <Frame>
      <TouchableOpacity
        onPress={() => navigation.navigate(SettingsRouteNames.AvatarSelection)}
      >
        <Font>Select avatar</Font>
      </TouchableOpacity>
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

import React from "react";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { useEdgeSpacing, useTheme } from "../providers/Theming";
import { createStackNavigator } from "@react-navigation/stack";
import { RouteNames } from "../../route-names";

const Stack = createStackNavigator();

function Search() {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  return (
    <>
      <Frame
        backgroundColor={theme.colors.background}
        flex={1}
        justifyContent="center"
        alignItems="center"
        paddingLeft={spacing.horizontal}
        paddingRight={spacing.horizontal}
      >
        <Font>Not yet implement</Font>
      </Frame>
    </>
  );
}

function Root() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: Header,
      }}
    >
      <Stack.Screen name={RouteNames.Search} component={Search} />
    </Stack.Navigator>
  );
}

export { Root as Search };

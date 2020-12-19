import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { RouteNames } from "../../route-names";
import { useEdgeSpacing, useTheme } from "../providers/Theming";
import { useSearch } from "../../api/useSearch";
import { useDebounce } from "../../hooks/use-debounce";
import { PostsList } from "../../components/PostsList";

const Stack = createStackNavigator();

function Search() {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  const [rawTerm, setTerm] = useState("");
  const term = useDebounce(rawTerm, 200);
  const { data } = useSearch(term);
  return (
    <Frame flexDirection="column">
      <Frame
        backgroundColor={theme.colors.background}
        paddingLeft={spacing.horizontal}
        paddingRight={spacing.horizontal}
        paddingTop={spacing.horizontal}
        paddingBottom={spacing.horizontal}
      >
        <TextInput
          clearButtonMode="always"
          placeholderTextColor={theme.colors.foregroundPrimary}
          value={rawTerm}
          onChangeText={(value) => setTerm(value)}
          numberOfLines={2}
          style={{
            ...(theme.typography.caption as Object),
            width: "100%",
            maxHeight: 80,
            paddingTop: theme.units.small,
            paddingBottom: theme.units.small,
            paddingLeft: theme.units.medium,
            paddingRight: theme.units.medium,
            backgroundColor: theme.colors.backgroundAccent,
            borderRadius: theme.constants.borderRadius,
          }}
        />
      </Frame>
      <Frame>
        <PostsList data={data} />
      </Frame>
    </Frame>
  );
}

function Root() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: Header,
        animationEnabled: false,
      }}
    >
      <Stack.Screen
        name={RouteNames.Search}
        component={Search}
        options={{
          animationEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

export { Root as Search };

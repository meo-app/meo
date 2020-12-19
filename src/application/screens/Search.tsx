import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { RouteNames } from "../../route-names";
import { useEdgeSpacing, useTheme } from "../providers/Theming";
import { useSearch } from "../../api/useSearch";
import { Font } from "../../components/Font";
import { useDebounce } from "../../hooks/use-debounce";

const Stack = createStackNavigator();

function Search() {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  const [rawTerm, setTerm] = useState("");
  const term = useDebounce(rawTerm, 500);
  const { refetch, data, isLoading, isFetching, status, isIdle } = useSearch(
    term
  );
  return (
    <>
      <Frame
        backgroundColor={theme.colors.background}
        flex={1}
        paddingLeft={spacing.horizontal}
        paddingRight={spacing.horizontal}
        paddingTop={spacing.horizontal}
      >
        <TextInput
          autoFocus
          placeholder="Search"
          placeholderTextColor={theme.colors.foregroundPrimary}
          value={rawTerm}
          onChangeText={(value) => setTerm(value)}
          numberOfLines={2}
          style={{
            ...(theme.typography.body as Object),
            width: "100%",
            maxHeight: 80,
            padding: theme.units.medium,
            backgroundColor: theme.colors.backgroundAccent,
            borderRadius: theme.constants.borderRadius,
          }}
        />
        <Frame>
          <Font variant="caption">
            {JSON.stringify(
              { isLoading, status, isFetching, isIdle, data },
              null,
              2
            )}
          </Font>
        </Frame>
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

import { createStackNavigator } from "@react-navigation/stack";
import { opacify } from "polished";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, ScrollView } from "react-native-gesture-handler";
import { QueryIds } from "../../api/QueryIds";
import { useSearch } from "../../api/useSearch";
import { useTransaction } from "../../api/useTransaction";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Grid } from "../../components/Grid";
import { Header } from "../../components/Header";
import { PostsList } from "../../components/PostsList";
import { useDebounce } from "../../hooks/use-debounce";
import { RouteNames } from "../../route-names";
import { useEdgeSpacing, useTheme } from "../providers/Theming";
import { useStyles } from "../../hooks/use-styles";

const Stack = createStackNavigator();

function Search() {
  const styles = useStyles((theme) => ({
    root: {
      position: "relative",
      zIndex: 1,
      width: "100%",
      justifyContent: "flex-end",
      height: 160,
      borderRadius: theme.constants.borderRadius,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.backgroundAccent,
      backgroundColor: theme.colors.backgroundAccent,
      shadowColor: opacify(0.5, theme.colors.absoluteDark),
      padding: theme.units.medium,
      ...theme.constants.shadow,
    },
    decoration: {
      ...theme.constants.shadow,
      position: "absolute",
      borderRadius: theme.constants.borderRadius,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.backgroundAccent,
      backgroundColor: theme.colors.background,
      // backgroundColor: "red",
      bottom: -10,
      width: "100%",
      height: 100,
      zIndex: 0,
    },
  }));
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  const [rawTerm, setTerm] = useState("");
  const term = useDebounce(rawTerm, 200);
  const { data } = useSearch(term);
  const { data: hashtags } = useTransaction<{ total: string; value: string }>(
    QueryIds.topHashtags,
    "select count(value) as total, value from hashtags group by value order by total desc limit 4"
  );
  return (
    <Frame
      flexDirection="column"
      backgroundColor={theme.colors.background}
      flex={1}
    >
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
          placeholder="thoughts or tags"
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
            borderColor: theme.colors.backgroundAccent,
            borderWidth: 1,
          }}
        />
      </Frame>
      <ScrollView>
        <Grid
          gap="medium"
          numColumns={2}
          margin={theme.units[spacing.horizontal]}
        >
          {hashtags?.map((item) => (
            <View
              key={item.value + item.total}
              style={{
                width: "100%",
              }}
            >
              <View key={item.total + item.value} style={styles.root}>
                <Font variant="display">{item.value}</Font>
                <Font variant="caption">{item.total} thoughts</Font>
              </View>
              <View
                style={[
                  styles.decoration,
                  {
                    bottom: -10,
                    transform: [{ scale: 0.92 }],
                  },
                ]}
              />
              <View
                style={[
                  styles.decoration,
                  {
                    bottom: -5,
                    transform: [{ scale: 0.96 }],
                  },
                ]}
              />
            </View>
          ))}
        </Grid>

        <Frame
          justifyContent="center"
          flex={1}
          alignItems="center"
          paddingLeft={spacing.horizontal}
          paddingRight={spacing.horizontal}
        >
          <Frame
            style={{
              height: "80%",
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Font>Stuff here</Font>
          </Frame>
        </Frame>
        <Frame>
          <PostsList data={data} />
        </Frame>
      </ScrollView>
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

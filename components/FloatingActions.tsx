import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  useEdgeSpacing,
  useTheme,
  ThemeProvider,
  FlipColorScheme,
} from "../application/providers/Theming";
import { Frame } from "./Frame";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Plus } from "../application/icons/Plus";
import { LinearGradient } from "expo-linear-gradient";
import { transparentize, darken, lighten } from "polished";
import { Font } from "./Font";
import { useColorScheme } from "react-native-appearance";
import { Units } from "../foundations/Spacing";

function FloatingActionsDock() {
  const theme = useTheme();
  const navigation = useNavigation();
  const spacing = useEdgeSpacing();
  return (
    <Frame
      flexDirection="row"
      justifyContent="space-between"
      style={{
        backgroundColor: theme.colors.background,
        marginRight: theme.units[spacing.horizontal],
        marginLeft: theme.units[spacing.horizontal],
        height: 60,
        borderRadius: 999,
        elevation: 2,
        position: "relative",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      }}
    >
      <Frame flexGrow={1} alignItems="center" justifyContent="center">
        <Font variant="display" color="foregroundSecondary">
          A
        </Font>
      </Frame>
      <Frame flexGrow={1} alignItems="center" justifyContent="center">
        <TouchableHighlight onPress={() => navigation.navigate("Search")}>
          <Font variant="display" color="foregroundSecondary">
            B
          </Font>
        </TouchableHighlight>
      </Frame>
    </Frame>
  );
}

function FloatingMainAction() {
  const size: keyof Units = "large";
  const theme = useTheme();
  const { navigate } = useNavigation();
  const spacing = useEdgeSpacing();
  return (
    <Frame
      alignItems="center"
      style={{
        top: -theme.scales[size] / 2,
        zIndex: 999, // TODO: make an absoluteRadius constant
        position: "absolute",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        width: "100%",
      }}
    >
      <TouchableHighlight
        underlayColor={lighten(0.6, theme.colors.background)}
        onPress={() => navigate("Create")}
        style={{
          width: theme.scales[size],
          height: theme.scales[size],
          backgroundColor: theme.colors.background,
          elevation: 2,
          borderRadius: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Plus />
      </TouchableHighlight>
    </Frame>
  );
}

function FloatingActions() {
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  return (
    <Frame
      alignItems="baseline"
      justifyContent="space-evenly"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 110,
      }}
    >
      <FlipColorScheme>
        <FloatingMainAction />
      </FlipColorScheme>
      <LinearGradient
        colors={[
          transparentize(1, theme.colors.background),
          theme.colors.background,
        ]}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 0,
          y: 0.5,
        }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 110,
          width: "100%",
        }}
      >
        <FlipColorScheme>
          <FloatingActionsDock />
        </FlipColorScheme>
      </LinearGradient>
    </Frame>
  );
}

export { FloatingActions };

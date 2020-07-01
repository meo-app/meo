import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  useEdgeSpacing,
  useTheme,
  ThemeProvider,
  FlipColorScheme,
} from "../application/providers/Theming";
import { Frame } from "./Frame";
import { TouchableHighlight } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { transparentize, darken, lighten } from "polished";
import { Font } from "./Font";
import { useColorScheme } from "react-native-appearance";
import { Units } from "../foundations/Spacing";
import { Icon } from "./Icon/Icon";
import { Alert } from "react-native";

interface Props {
  onHomePressAtHome?: () => void;
}

function FloatingActionsDock({ onHomePressAtHome }: Props) {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
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
        <TouchableHighlight
          style={{
            height: theme.scales.largest,
            width: theme.scales.largest,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            if (route.name === "Home") {
              onHomePressAtHome && onHomePressAtHome();
              return;
            }
            navigation.navigate("Home");
          }}
        >
          <Icon type="Home" size="medium" />
        </TouchableHighlight>
      </Frame>
      <Frame flexGrow={1} alignItems="center" justifyContent="center">
        <TouchableHighlight
          onPress={() => navigation.navigate("Search")}
          style={{
            height: theme.scales.largest,
            width: theme.scales.largest,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon type="Search" size="medium" />
        </TouchableHighlight>
      </Frame>
    </Frame>
  );
}

function FloatingMainAction() {
  const size: keyof Units = "largest";
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
        <Icon type="Plus" size="medium" />
      </TouchableHighlight>
    </Frame>
  );
}

function FloatingActions({ onHomePressAtHome }: Props) {
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
          <FloatingActionsDock onHomePressAtHome={onHomePressAtHome} />
        </FlipColorScheme>
      </LinearGradient>
    </Frame>
  );
}

export { FloatingActions };

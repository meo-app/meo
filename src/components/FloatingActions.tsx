import { LinearGradient } from "expo-linear-gradient";
import { lighten, transparentize } from "polished";
import React, { useCallback, useContext } from "react";
import { Pressable, PressableProps } from "react-native";
import { useHomeContext } from "../application/providers/AppProvider";
import {
  FlipColorScheme,
  useEdgeSpacing,
  useTheme,
} from "../application/providers/Theming";
import { Units } from "../foundations/Spacing";
import { useStyles } from "../hooks/use-styles";
import { Frame, useFrameStyles } from "./Frame";
import { Icon } from "./Icon/Icon";

const CREATE_BUTTON_SIZE: keyof Units = "largest";
const CREATE_BUTTON_DIMENSION = 1.3;

interface Props {
  onHomePress: () => void;
  onCreatePress: () => void;
  onSearchPress: () => void;
}

const Context = React.createContext<Partial<Props>>({});

function FloatingActions({ onHomePress, onCreatePress, onSearchPress }: Props) {
  const theme = useTheme();
  const { setTabBarHeight } = useHomeContext();
  const styles = useStyles(() => ({
    root: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 110,
    },
  }));

  return (
    <Frame
      onLayout={(event) => {
        setTabBarHeight(
          event.nativeEvent.layout.height +
            theme.units[CREATE_BUTTON_SIZE] / CREATE_BUTTON_DIMENSION / 2
        );
      }}
      alignItems="baseline"
      justifyContent="space-evenly"
      style={styles.root}
    >
      <Context.Provider
        value={{
          onCreatePress,
          onHomePress,
          onSearchPress,
        }}
      >
        <FlipColorScheme>
          <CreateButton />
        </FlipColorScheme>
        <Gradient>
          <Dock />
        </Gradient>
      </Context.Provider>
    </Frame>
  );
}

const Gradient: React.FunctionComponent = function Gradient({ children }) {
  const theme = useTheme();
  return (
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
      <FlipColorScheme>{children}</FlipColorScheme>
    </LinearGradient>
  );
};

function Dock() {
  const spacing = useEdgeSpacing();
  const { onSearchPress, onHomePress } = useContext(Context);
  const touch = useFrameStyles({
    height: "largest",
    alignItems: "center",
    justifyContent: "center",
    style: {
      width: "100%",
    },
  });

  const touchable: PressableProps["style"] = useCallback(
    ({ pressed }) => ({
      ...touch,
      opacity: pressed ? 0.5 : 1,
    }),
    [touch]
  );

  const styles = useStyles((theme) => ({
    root: {
      backgroundColor: theme.colors.background,
      marginRight: theme.units[spacing.horizontal] * 1.5,
      marginLeft: theme.units[spacing.horizontal] * 1.5,
      height: theme.scales.largest,
      borderRadius: theme.constants.absoluteRadius,
      ...theme.constants.shadow,
    },
  }));

  return (
    <Frame
      flexDirection="row"
      justifyContent="space-between"
      style={styles.root}
    >
      <Frame flexGrow={1}>
        <Pressable onPress={() => onHomePress?.()} style={touchable}>
          <Icon type="Home" size="medium" />
        </Pressable>
      </Frame>
      <Frame flexGrow={1}>
        <Pressable onPress={() => onSearchPress?.()} style={touchable}>
          <Icon type="Search" size="medium" />
        </Pressable>
      </Frame>
    </Frame>
  );
}

function CreateButton() {
  const theme = useTheme();
  const { onCreatePress } = useContext(Context);
  const styles = useStyles((theme) => ({
    root: {
      top: -theme.scales[CREATE_BUTTON_SIZE] / CREATE_BUTTON_DIMENSION,
      zIndex: theme.constants.absoluteRadius,
      position: "absolute",
      width: "100%",
      ...theme.constants.shadow,
    },
    pressabe: {
      width: theme.scales[CREATE_BUTTON_SIZE],
      height: theme.scales[CREATE_BUTTON_SIZE],
      borderRadius: theme.constants.absoluteRadius,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...theme.constants.shadow,
    },
  }));

  return (
    <Frame alignItems="center" pointerEvents="box-none" style={styles.root}>
      <Pressable
        onPress={() => onCreatePress?.()}
        style={({ pressed }) => ({
          ...styles.pressabe,
          backgroundColor: pressed
            ? lighten(0.1, theme.colors.background)
            : theme.colors.backgroundAccent,
        })}
      >
        <Icon type="Plus" size="medium" />
      </Pressable>
    </Frame>
  );
}

export { FloatingActions };

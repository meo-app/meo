import { LinearGradient } from "expo-linear-gradient";
import { lighten, transparentize } from "polished";
import React, { useContext } from "react";
import {
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import {
  FlipColorScheme,
  useEdgeSpacing,
  useTheme,
} from "../application/providers/Theming";
import { Units } from "../foundations/Spacing";
import { Frame, useFrameStyles } from "./Frame";
import { Icon } from "./Icon/Icon";

interface Props {
  onHomePress: () => void;
  onCreatePress: () => void;
  onSearchPress: () => void;
}

const Context = React.createContext<Partial<Props>>({});

function FloatingActions({ onHomePress, onCreatePress, onSearchPress }: Props) {
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
  const theme = useTheme();
  const spacing = useEdgeSpacing();
  const { onSearchPress, onHomePress } = useContext(Context);
  const touchable = useFrameStyles({
    height: "largest",
    width: "largest",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  });
  return (
    <Frame
      flexDirection="row"
      justifyContent="space-between"
      style={{
        backgroundColor: theme.colors.background,
        marginRight: theme.units[spacing.horizontal],
        marginLeft: theme.units[spacing.horizontal],
        height: theme.scales.largest,
        borderRadius: theme.constants.absoluteRadius,
        ...theme.constants.shadow,
      }}
    >
      <Frame flexGrow={1} alignItems="center" justifyContent="center">
        <TouchableOpacity onPress={() => onHomePress?.()} style={touchable}>
          <Icon type="Home" size="medium" />
        </TouchableOpacity>
      </Frame>
      <Frame flexGrow={1} alignItems="center" justifyContent="center">
        <TouchableOpacity onPress={() => onSearchPress?.()} style={touchable}>
          <Icon type="Search" size="medium" />
        </TouchableOpacity>
      </Frame>
    </Frame>
  );
}

function CreateButton() {
  const size: keyof Units = "largest";
  const theme = useTheme();
  const { onCreatePress } = useContext(Context);
  return (
    <Frame
      alignItems="center"
      style={{
        top: -theme.scales[size] / 1.3,
        zIndex: theme.constants.absoluteRadius,
        position: "absolute",
        width: "100%",
        ...theme.constants.shadow,
      }}
    >
      <TouchableHighlight
        underlayColor={lighten(0.6, theme.colors.background)}
        onPress={() => onCreatePress?.()}
        style={{
          width: theme.scales[size],
          height: theme.scales[size],
          backgroundColor: theme.colors.backgroundAccent,
          borderRadius: theme.constants.absoluteRadius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...theme.constants.shadow,
        }}
      >
        <Icon type="Plus" size="medium" />
      </TouchableHighlight>
    </Frame>
  );
}

export { FloatingActions };

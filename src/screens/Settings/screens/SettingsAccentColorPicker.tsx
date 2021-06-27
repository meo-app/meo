import React from "react";
import { Pressable, ScrollView, useWindowDimensions } from "react-native";
import { Frame } from "../../../components/Frame";
import { Icon } from "../../../components/Icon/Icon";
import { NavigationHeader } from "../../../components/NavigationHeader";
import {
  usePreferredAccentColorMutation,
  usePreferredAccentColorQuery,
} from "../../../hooks/use-preferred-accent-color";
import { DEFAULT_ACCENT_COLOR } from "../../../providers/Theming/app-theme-definition";
import { useTheme } from "../../../providers/Theming/hooks/use-theme";

const PREFERRED_ACCENT_COLOR_STORAGE_VERSION = 1;
const ACCENT_COLORS = [
  "#2D9CDB",
  "rgb(121, 75, 196)",
  "rgb(224, 36, 94)",
  "rgb(23, 191, 99)",
  "rgb(244, 93, 34)",
  "rgb(255, 173, 31)",
];

function Color({
  backgroundColor,
  selected,
  ...props
}: {
  backgroundColor: string;
  selected?: boolean;
} & Omit<React.ComponentProps<typeof Pressable>, "style">) {
  const theme = useTheme();
  const { height } = useWindowDimensions();
  return (
    <Frame
      paddingHorizontal="small"
      paddingVertical="small"
      justifyContent="center"
      alignItems="center"
      style={{
        width: "50%",
        height: height / 4,
      }}
    >
      <Pressable
        style={{
          backgroundColor,
          borderRadius: theme.constants.absoluteRadius,
          width: 110,
          height: 110,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        {...props}
      >
        {selected && <Icon type="Check" color="absoluteLight" size="largest" />}
      </Pressable>
    </Frame>
  );
}

function SettingsAccentColorPicker() {
  const { data } = usePreferredAccentColorQuery();
  const { mutate } = usePreferredAccentColorMutation();
  return (
    <>
      <NavigationHeader title="Pick your favorite color" />
      <Frame flex={1} backgroundColor="background" paddingTop="small">
        <ScrollView style={{ flex: 1 }}>
          <Frame
            flex={1}
            flexWrap="wrap"
            flexDirection="row"
            justifyContent="space-around"
          >
            {ACCENT_COLORS.map((color) => (
              <Color
                key={color}
                backgroundColor={color}
                onPress={() => mutate(color)}
                selected={
                  !data ? DEFAULT_ACCENT_COLOR === color : data === color
                }
              />
            ))}
          </Frame>
        </ScrollView>
      </Frame>
    </>
  );
}

export { SettingsAccentColorPicker, PREFERRED_ACCENT_COLOR_STORAGE_VERSION };

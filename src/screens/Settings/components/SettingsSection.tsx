import React from "react";
import { Pressable } from "react-native";
import { Font } from "../../../components/Font";
import { Frame, useFrame } from "../../../components/Frame";
import { Colors } from "../../../foundations/Colors";
import { usePaddingHorizontal } from "../../../providers/Theming/hooks/use-padding-horizontal";
import { useTheme } from "../../../providers/Theming/hooks/use-theme";

const Title = React.memo<{ text: string }>(function Title({ text }) {
  return (
    <Font
      variant="caption"
      marginTop="larger"
      marginBottom="medium"
      color="foregroundSecondary"
      style={{
        textTransform: "uppercase",
      }}
    >
      {text}
    </Font>
  );
});

interface Props {
  title: string;
  actions: ({ text?: string; color?: keyof Colors } & React.ComponentProps<
    typeof Pressable
  >)[];
}

function SettingsSection({ title, actions }: Props) {
  const theme = useTheme();
  const { paddingHorizontal } = usePaddingHorizontal();
  const rowStyles = useFrame({
    paddingHorizontal,
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: "medium",
    backgroundColor: "background",
    justifyContent: "space-between",
  });
  return (
    <Frame style={{ marginHorizontal: paddingHorizontal }}>
      <Title text={title} />
      <Frame
        style={{
          overflow: "hidden",
          borderRadius: theme.constants.borderRadius,
        }}
      >
        {actions.map(({ text, color, children, ...props }, index) => (
          <Pressable {...props} style={[rowStyles]} key={`${text}-${index}`}>
            <Font color={color || "primary"}>{text}</Font>
            {children}
          </Pressable>
        ))}
      </Frame>
    </Frame>
  );
}

export { SettingsSection };

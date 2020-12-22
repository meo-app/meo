import React from "react";
import { StyleSheet, TextInput, Keyboard } from "react-native";
import { Font } from "../../../components/Font";
import { Frame } from "../../../components/Frame";
import { useTheme } from "../../providers/Theming";
import { ScrollView } from "react-native-gesture-handler";

const OnboardingInsertName: React.FunctionComponent = function OnboardingInsertName() {
  const theme = useTheme();
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      style={{
        flex: 1,
      }}
    >
      <Frame marginBottom="large">
        <Font variant="display">What is your name?</Font>
      </Frame>
      <TextInput
        blurOnSubmit
        autoCapitalize="words"
        onBlur={Keyboard.dismiss}
        style={{
          ...(theme.typography.caption as Object),
          width: "100%",
          paddingTop: theme.units.medium,
          paddingBottom: theme.units.medium,
          paddingLeft: theme.units.medium,
          paddingRight: theme.units.medium,
          backgroundColor: theme.colors.background,
          borderRadius: theme.constants.borderRadius,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.foregroundSecondary,
        }}
      />
    </ScrollView>
  );
};

export { OnboardingInsertName };

import React from "react";
import { Font } from "../../../components/Font";
import { AvatarSelection } from "../AvatarSelection";
import { Frame } from "../../../components/Frame";

function OnboardingAvatarSelection() {
  return (
    <Frame flex={1}>
      <Font
        variant="display"
        style={{
          textAlign: "center",
        }}
      >
        Select your avatar
      </Font>
      <AvatarSelection />
    </Frame>
  );
}

export { OnboardingAvatarSelection };

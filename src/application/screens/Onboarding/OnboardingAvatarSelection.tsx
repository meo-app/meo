import React from "react";
import { Font } from "../../../components/Font";
import { AvatarSelection } from "../AvatarSelection";

function OnboardingAvatarSelection() {
  return (
    <>
      <Font
        variant="display"
        style={{
          textAlign: "center",
        }}
      >
        Select your avatar
      </Font>
      <AvatarSelection />
    </>
  );
}

export { OnboardingAvatarSelection };

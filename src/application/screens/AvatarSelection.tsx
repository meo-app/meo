import React from "react";
import { Avatar01 } from "../../components/Avatars/Avatar01";
import { Avatar02 } from "../../components/Avatars/Avatar02";
import { Avatar03 } from "../../components/Avatars/Avatar03";
import { Avatar04 } from "../../components/Avatars/Avatar04";
import { Frame } from "../../components/Frame";
import { useTheme } from "../providers/Theming";

function UploadButton() {
  const theme = useTheme();
  return (
    <Frame
      debugTrace
      backgroundColor="red"
      style={{
        width: theme.scales.largest,
        height: theme.scales.largest,
        borderRadius: theme.constants.absoluteRadius,
      }}
    />
  );
}

function AvatarSelection() {
  const theme = useTheme();
  return (
    <Frame
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Frame
        style={{
          height: "80%",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {[
          <Avatar01 />,
          <Avatar02 />,
          <Avatar03 />,
          <Avatar04 />,
          <Avatar01 />,
          <UploadButton />,
        ].map((content, index) => {
          return (
            <Frame
              key={`avatar-${index}`}
              marginTop="largest"
              style={{
                width: "50%",
                height: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {content}
            </Frame>
          );
        })}
      </Frame>
    </Frame>
  );
}

export { AvatarSelection };

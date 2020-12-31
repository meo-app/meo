import React from "react";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { Header } from "./Header";

interface Props extends React.ComponentProps<typeof Header> {
  title: string;
}

function SubtitleHeader({ title, ...props }: Props) {
  return (
    <Header {...props} hideBackground>
      <Frame
        justifyContent="center"
        style={{
          width: "100%",
        }}
      >
        <Font variant="subtitle">{title}</Font>
      </Frame>
    </Header>
  );
}

export { SubtitleHeader };

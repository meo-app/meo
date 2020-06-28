import React from "react";
import { useEdgeSpacing } from "../application/providers/Theming";
import { Frame } from "./Frame";

const SafeStackArea: React.FunctionComponent = function SafeStackArea({
  children,
}) {
  const spacing = useEdgeSpacing();
  return (
    <Frame paddingRight={spacing.horizontal} paddingLeft={spacing.horizontal}>
      {children}
    </Frame>
  );
};

export { SafeStackArea };

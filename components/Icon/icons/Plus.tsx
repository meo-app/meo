import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { SVGIconProps } from "../SVGIconProps";

const Plus: React.FunctionComponent<SVGIconProps> = function Plus({
  width,
  height,
  color,
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6.857 6.857V0h2.286v6.857H16v2.286H9.143V16H6.857V9.143H0V6.857h6.857z"
        fill={color}
      />
    </Svg>
  );
};

export { Plus };

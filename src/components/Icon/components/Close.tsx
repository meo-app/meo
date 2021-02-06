import React from "react";
import { SVGIconProps } from "../SVGIconProps";
import Svg, { Path } from "react-native-svg";

const Close: React.FunctionComponent<SVGIconProps> = function Home({
  width,
  height,
  color,
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 9.556L20.556 1 23 3.444 14.444 12 23 20.556 20.556 23 12 14.444 3.444 23 1 20.556 9.556 12 1 3.444 3.444 1 12 9.556z"
        fill={color}
      />
    </Svg>
  );
};

export { Close };

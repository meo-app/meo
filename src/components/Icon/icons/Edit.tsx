import React from "react";
import { SVGIconProps } from "../SVGIconProps";
import Svg, { Path } from "react-native-svg";

const Edit: React.FunctionComponent<SVGIconProps> = function Home({
  width,
  height,
  color,
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.9 6.829l4.242 4.243-9.9 9.899H3v-4.243l9.9-9.9zm1.414-1.414l2.121-2.122a1 1 0 011.414 0l2.829 2.829a1 1 0 010 1.414l-2.122 2.12-4.242-4.241z"
        fill={color}
      />
    </Svg>
  );
};

export { Edit };

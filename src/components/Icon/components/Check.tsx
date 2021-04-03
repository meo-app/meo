import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { SVGIconProps } from "../SVGIconProps";

const Check: React.FunctionComponent<SVGIconProps> = function Check({
  width,
  height,
  color,
}: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.99999 15.172L19.192 5.979L20.607 7.393L9.99999 18L3.63599 11.636L5.04999 10.222L9.99999 15.172Z"
        fill={color}
      />
    </Svg>
  );
};

export { Check };

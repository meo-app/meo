import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { SVGIconProps } from "../SVGIconProps";

const Back: React.FunctionComponent<SVGIconProps> = function Back({
  width,
  height,
  color,
}: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.828 12L15.778 16.95L14.364 18.364L8 12L14.364 5.63599L15.778 7.04999L10.828 12Z"
        fill={color}
      />
    </Svg>
  );
};

export { Back };

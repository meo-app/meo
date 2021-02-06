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
        d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414-4.95 4.95z"
        fill={color}
      />
    </Svg>
  );
};

export { Back };

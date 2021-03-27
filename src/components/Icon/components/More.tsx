import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { SVGIconProps } from "../SVGIconProps";

const More: React.FunctionComponent<SVGIconProps> = function Back({
  width,
  height,
  color,
}: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.16667 11C5.525 11 5 11.525 5 12.1667C5 12.8083 5.525 13.3333 6.16667 13.3333C6.80833 13.3333 7.33333 12.8083 7.33333 12.1667C7.33333 11.525 6.80833 11 6.16667 11ZM17.8333 11C17.1917 11 16.6667 11.525 16.6667 12.1667C16.6667 12.8083 17.1917 13.3333 17.8333 13.3333C18.475 13.3333 19 12.8083 19 12.1667C19 11.525 18.475 11 17.8333 11ZM12 11C11.3583 11 10.8333 11.525 10.8333 12.1667C10.8333 12.8083 11.3583 13.3333 12 13.3333C12.6417 13.3333 13.1667 12.8083 13.1667 12.1667C13.1667 11.525 12.6417 11 12 11Z"
        fill={color}
      />
    </Svg>
  );
};

export { More };

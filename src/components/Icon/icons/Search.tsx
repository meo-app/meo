import React from "react";
import Svg, { Path } from "react-native-svg";
import { SVGIconProps } from "../SVGIconProps";

const Search: React.FunctionComponent<SVGIconProps> = function Search({
  width,
  height,
  color,
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0111 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 01-1.969 5.617zm-2.006-.742A6.977 6.977 0 0018 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 004.875-1.975l.15-.15zm-3.847-8.699a2 2 0 102.646 2.646 4 4 0 11-2.646-2.646z"
        fill={color}
      />
    </Svg>
  );
};

export { Search };

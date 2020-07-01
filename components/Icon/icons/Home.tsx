import React from "react";
import { SVGIconProps } from "../SVGIconProps";
import Svg, { Path } from "react-native-svg";

const Home: React.FunctionComponent<SVGIconProps> = function Home({
  width,
  height,
  color,
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 21.648H5a1 1 0 01-1-1v-9H1L11.327 2.26a1 1 0 011.346 0L23 11.648h-3v9a1 1 0 01-1 1zm-13-2h12V9.805l-6-5.454-6 5.454v9.843zm2-4h8v2H8v-2z"
        fill={color}
      />
    </Svg>
  );
};

export { Home };

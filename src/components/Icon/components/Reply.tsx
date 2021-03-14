import React from "react";
import { SVGIconProps } from "../SVGIconProps";
import Svg, { Path } from "react-native-svg";

const Reply: React.FunctionComponent<SVGIconProps> = function Home({
  width,
  height,
  color,
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13.8182 4.53333V6.22222H5.63636V17.5251L7.07882 16.3556H18.7273V10.4444H20.3636V17.2C20.3636 17.424 20.2774 17.6387 20.124 17.7971C19.9706 17.9555 19.7624 18.0444 19.5455 18.0444H7.645L4 21V5.37778C4 5.15382 4.0862 4.93903 4.23964 4.78067C4.39308 4.6223 4.60119 4.53333 4.81818 4.53333H13.8182ZM17.9091 4.53333V2H19.5455V4.53333H22V6.22222H19.5455V8.75556H17.9091V6.22222H15.4545V4.53333H17.9091Z"
        fill={color}
      />
    </Svg>
  );
};

export { Reply };

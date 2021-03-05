import React from "react";
import { SVGIconProps } from "../SVGIconProps";
import Svg, { Path } from "react-native-svg";

const Share: React.FunctionComponent<SVGIconProps> = function Share({
  width,
  height,
  color,
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19H20V14H22V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V14H4V19ZM12 10H9C8.05306 9.99934 7.11945 10.2231 6.27571 10.653C5.43197 11.0828 4.70212 11.7066 4.146 12.473C4.50098 10.6505 5.47863 9.00808 6.91148 7.82717C8.34433 6.64626 10.1432 6.00032 12 6V2L20 8L12 14V10Z"
        fill={color}
      />
    </Svg>
  );
};

export { Share };

import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <Path
        d="M6.857 6.857V0h2.286v6.857H16v2.286H9.143V16H6.857V9.143H0V6.857h6.857z"
        fill="#000"
      />
    </Svg>
  );
}

export { Plus };

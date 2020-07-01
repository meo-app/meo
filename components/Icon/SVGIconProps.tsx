import { Plus } from "./icons/Plus";
import { Home } from "./icons/Home";

export interface SVGIconProps {
  width: number;
  height: number;
  color: string;
}

export const ICONS: {
  [key in "Plus" | "Home"]: React.FunctionComponent<SVGIconProps>;
} = {
  Plus,
  Home,
};

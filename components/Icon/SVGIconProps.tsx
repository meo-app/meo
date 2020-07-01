import { Plus } from "./icons/Plus";
import { Home } from "./icons/Home";
import { Search } from "./icons/Search";

export interface SVGIconProps {
  width: number;
  height: number;
  color: string;
}

type IconTypes = "Plus" | "Home" | "Search";

export const ICONS: {
  [key in IconTypes]: React.FunctionComponent<SVGIconProps>;
} = {
  Plus,
  Home,
  Search,
};
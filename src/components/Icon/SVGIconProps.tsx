import { Plus } from "./icons/Plus";
import { Home } from "./icons/Home";
import { Search } from "./icons/Search";
import { Close } from "./icons/Close";
import { Back } from "./icons/Back";
import { Hamburguer } from "./icons/Hamburguer";

export interface SVGIconProps {
  width: number;
  height: number;
  color: string;
}

type IconTypes = "Plus" | "Home" | "Search" | "Close" | "Back" | "Hamburguer";

export const ICONS: {
  [key in IconTypes]: React.FunctionComponent<SVGIconProps>;
} = {
  Plus,
  Home,
  Search,
  Close,
  Back,
  Hamburguer,
};

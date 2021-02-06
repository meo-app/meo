import { Plus } from "./components/Plus";
import { Home } from "./components/Home";
import { Search } from "./components/Search";
import { Close } from "./components/Close";
import { Back } from "./components/Back";
import { Hamburguer } from "./components/Hamburguer";
import { Edit } from "./components/Edit";

export interface SVGIconProps {
  width: number;
  height: number;
  color: string;
}

type IconTypes =
  | "Plus"
  | "Home"
  | "Search"
  | "Close"
  | "Back"
  | "Hamburguer"
  | "Edit";

export const ICONS: {
  [key in IconTypes]: React.FunctionComponent<SVGIconProps>;
} = {
  Plus,
  Home,
  Search,
  Close,
  Back,
  Hamburguer,
  Edit,
};

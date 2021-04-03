import { Plus } from "./components/Plus";
import { Home } from "./components/Home";
import { Search } from "./components/Search";
import { Close } from "./components/Close";
import { Back } from "./components/Back";
import { Hamburguer } from "./components/Hamburguer";
import { Edit } from "./components/Edit";
import { Camera } from "./components/Camera";
import { Share } from "./components/Share";
import { Trash } from "./components/Trash";
import { Reply } from "./components/Reply";
import { More } from "./components/More";
import { Check } from "./components/Check";

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
  | "Edit"
  | "Camera"
  | "Share"
  | "Trash"
  | "Reply"
  | "More"
  | "Check";

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
  Camera,
  Share,
  Trash,
  Reply,
  More,
  Check,
};

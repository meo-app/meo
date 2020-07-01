import { Plus } from "./icons/Plus";

export interface SVGIconProps {
  width: number;
  height: number;
  color: string;
}

export const ICONS: {
  [key: string]: React.FunctionComponent<SVGIconProps>;
} = {
  Plus,
};

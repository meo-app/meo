import { Typography } from "./Typography";
import { Colors } from "./Colors";
import { Units, Scales } from "./Spacing";
import { Constants } from "./Constants";
import { APP_FONTS } from "../providers/Theming/app-theme-definition";

export interface Theme {
  typography: Typography<keyof typeof APP_FONTS>;
  colors: Colors;
  units: Units;
  scales: Scales;
  constants: Constants;
}

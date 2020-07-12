import { StyleProp, TextStyle } from "react-native";

export interface Typography {
  display: StyleProp<TextStyle>;
  body: StyleProp<TextStyle>;
  caption: StyleProp<TextStyle>;
}

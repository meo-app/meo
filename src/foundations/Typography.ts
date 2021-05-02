import { TextStyle as RNTextStyle } from "react-native";

type TextStyle<TFonts extends string> = RNTextStyle & {
  fontFamily: TFonts;
};

export interface Typography<TFonts extends string> {
  display: TextStyle<TFonts>;
  body: TextStyle<TFonts>;
  caption: TextStyle<TFonts>;
  subtitle: TextStyle<TFonts>;
  highlight: TextStyle<TFonts>;
  strong: TextStyle<TFonts>;
}

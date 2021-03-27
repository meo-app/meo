import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import Autolink from "react-native-autolink";
import { useTheme } from "../providers/Theming";
import { HASHTAG_REGEX } from "../shared/hashtag-utils";
import { NavigationParamsConfig } from "../shared/NavigationParamsConfig";
import { Font } from "./Font";

const PostTextContent = React.memo(function PostTextContent({
  value,
  numberOfLines,
  color = "foregroundPrimary",
  variant = "body",
}: {
  value: string;
  numberOfLines?: number;
} & Pick<React.ComponentProps<typeof Font>, "variant" | "color">) {
  const navigation = useNavigation<NavigationProp<NavigationParamsConfig>>();
  const theme = useTheme();
  return (
    <Autolink
      numberOfLines={numberOfLines}
      text={value}
      style={{
        ...theme.typography[variant],
        color: theme.colors[color],
      }}
      linkStyle={{
        ...theme.typography[variant],
        color: theme.colors.primary,
      }}
      customLinks={[
        {
          pattern: HASHTAG_REGEX,
          extractText: (args) => args[1],
          onPress: (args) => {
            navigation.navigate("HashtagViewer", {
              hashtag: args[0],
            });
          },
        },
      ]}
    />
  );
});

export { PostTextContent };

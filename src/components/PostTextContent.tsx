import { useNavigation } from "@react-navigation/native";
import React from "react";
import { RootStackRoutes } from "../root-stack-routes";
import { HASHTAG_REGEX } from "../utils/hashtag-regex";
import { Font } from "./Font";

function PostTextContent({
  value,
  numberOfLines,
}: {
  value: string;
  numberOfLines?: number;
}) {
  const navigation = useNavigation();
  return (
    <Font numberOfLines={numberOfLines}>
      {value.split(HASHTAG_REGEX).map((item, index) => {
        if (item[0] === "#") {
          return (
            <Font
              color="primary"
              key={`hashtag-${index}-${item}`}
              onPress={() =>
                navigation.navigate(RootStackRoutes.HashtagViewer, {
                  hashtag: item,
                })
              }
            >
              {item}
            </Font>
          );
        }

        return item;
      })}
    </Font>
  );
}

export { PostTextContent };

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { RouteNames } from "../route-names";
import { HASHTAG_REGEX } from "../utils/hashtag-regex";
import { Font } from "./Font";

function PostTextContent({ value }: { value: string }) {
  const navigation = useNavigation();
  return (
    <Font>
      {value.split(HASHTAG_REGEX).map((item, index) => {
        if (item[0] === "#") {
          return (
            <Font
              color="primary"
              key={`hashtag-${index}-${item}`}
              onPress={() =>
                navigation.navigate(RouteNames.HashtagViewer, {
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

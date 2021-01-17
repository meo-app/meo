import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { RootStackRoutes } from "../root-stack-routes";
import { HASHTAG_REGEX } from "../utils/hashtag-regex";
import { Font } from "./Font";

const PostTextContent = React.memo(function PostTextContent({
  value,
  numberOfLines,
}: {
  value: string;
  numberOfLines?: number;
}) {
  const navigation = useNavigation();
  const content = useMemo(() => value.split(HASHTAG_REGEX), [value]);
  return (
    <Font numberOfLines={numberOfLines}>
      {content.map((item, index) => {
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
});

export { PostTextContent };

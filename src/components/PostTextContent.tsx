import React from "react";
import { HASHTAG_REGEX } from "../utils/hashtag-regex";
import { Font } from "./Font";
import { Alert } from "react-native";

function PostTextContent({ value }: { value: string }) {
  return (
    <Font>
      {value.split(HASHTAG_REGEX).map((item, index) => {
        if (item[0] === "#") {
          return (
            <Font
              color="primary"
              key={`hashtag-${index}-${item}`}
              onPress={() => Alert.alert("TODO: navigate to hashtag")}
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

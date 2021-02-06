import * as React from "react";
import { Image } from "react-native";

function Avatar01() {
  return (
    <Image
      source={require("./assets/avatar-01.jpg")}
      style={{
        width: "100%",
        height: "100%",
      }}
      resizeMode="cover"
    />
  );
}

export { Avatar01 };

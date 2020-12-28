import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import { Frame } from "./Frame";
import { Icon } from "./Icon/Icon";

function OpenDrawerButton() {
  const navigation = useNavigation<DrawerNavigationProp<{}>>();
  return (
    <Pressable onPress={() => navigation.openDrawer()}>
      <Frame marginRight="medium">
        <Icon type="Hamburguer" />
      </Frame>
    </Pressable>
  );
}

export { OpenDrawerButton };

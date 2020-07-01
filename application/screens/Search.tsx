import React from "react";
import { View } from "react-native";
import { Font } from "../../components/Font";
import { FloatingActions } from "../../components/FloatingActions";

function Search() {
  return (
    <View style={{ flex: 1 }}>
      <Font>Hello</Font>
      <FloatingActions />
    </View>
  );
}

export { Search };

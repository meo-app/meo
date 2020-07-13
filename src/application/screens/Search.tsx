import React from "react";
import { View } from "react-native";
import { Font } from "../../components/Font";
import { Header } from "../../components/Header";

function Search() {
  return (
    <>
      <Header title="Search" />
      <View style={{ flex: 1 }}>
        <Font>Hello world search</Font>
      </View>
    </>
  );
}

export { Search };

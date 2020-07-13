import React from "react";
import { Font } from "../../components/Font";
import { Frame } from "../../components/Frame";
import { Header } from "../../components/Header";
import { useEdgeSpacing } from "../providers/Theming";

function Search() {
  const spacing = useEdgeSpacing();
  return (
    <>
      <Header title="Search" />
      <Frame
        flex={1}
        justifyContent="center"
        alignItems="center"
        marginTop={spacing.vertical}
        paddingLeft={spacing.horizontal}
        paddingRight={spacing.horizontal}
      >
        <Font>Not yet implement</Font>
      </Frame>
    </>
  );
}

export { Search };

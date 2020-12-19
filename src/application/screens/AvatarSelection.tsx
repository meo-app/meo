import React from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Avatar01 } from "../../components/Avatars/Avatar01";
import { Avatar02 } from "../../components/Avatars/Avatar02";
import { Avatar03 } from "../../components/Avatars/Avatar03";
import { Avatar04 } from "../../components/Avatars/Avatar04";
import { Frame } from "../../components/Frame";
import { useEdgeSpacing, useTheme } from "../providers/Theming";

function AvatarSelection() {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  return (
    <View>
      <FlatList<JSX.Element>
        keyExtractor={(_, index) => `avatar-key-${index}`}
        numColumns={2}
        data={[<Avatar01 />, <Avatar02 />, <Avatar03 />, <Avatar04 />]}
        style={{
          height: "100%",
          paddingTop: theme.units[spacing.vertical],
          paddingBottom: theme.units[spacing.vertical],
          paddingRight: theme.units[spacing.horizontal],
          paddingLeft: theme.units[spacing.horizontal],
        }}
        renderItem={({ item }) => (
          <Frame
            debugTrace
            style={{
              width: "50%",
              height: 80,
            }}
          >
            {item}
          </Frame>
        )}
      />
    </View>
  );
}

export { AvatarSelection };

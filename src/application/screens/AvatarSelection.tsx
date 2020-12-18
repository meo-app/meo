import React from "react";
import { Frame } from "../../components/Frame";
import { Font } from "../../components/Font";
import { Avatar01 } from "../../components/Avatars/Avatar01";
import { Avatar02 } from "../../components/Avatars/Avatar02";
import { ScrollView, FlatList } from "react-native-gesture-handler";
import { View } from "react-native";
import { useTheme, useEdgeSpacing } from "../providers/Theming";
import { Avatar03 } from "../../components/Avatars/Avatar03";
import { Avatar04 } from "../../components/Avatars/Avatar04";

function AvatarSelection() {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  return (
    <View>
      <FlatList<JSX.Element>
        style={{
          height: "100%",
          paddingTop: theme.units[spacing.vertical],
          paddingBottom: theme.units[spacing.vertical],
          paddingRight: theme.units[spacing.horizontal],
          paddingLeft: theme.units[spacing.horizontal],
        }}
        numColumns={2}
        data={[<Avatar01 />, <Avatar02 />, <Avatar03 />, <Avatar04 />]}
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
        keyExtractor={(_, index) => `avatar-key-${index}`}
      />
    </View>
  );
}

export { AvatarSelection };

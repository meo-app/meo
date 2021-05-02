import React, { useCallback } from "react";
import { Image, ListRenderItem, Pressable, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useTheme } from "../../providers/Theming/hooks/use-theme";
import {
  AvatarIds,
  AVATARS_LIST,
  DefaultAvatar,
} from "../../shared/avatars-list";
import { Frame } from "../Frame";
import { AvatarUploadButton } from "./components/AvatarUploadButton";
import { useAvatarSelectionContext } from "./hooks/use-avatar-selection-context";
import { useAvatarSelectionSize } from "./hooks/use-avatar-selection-size";

const data = [...AVATARS_LIST, { id: AvatarIds.__USER_PHOTO__ }];
const AvatarSelection = React.memo(function AvatarSelection() {
  const theme = useTheme();
  const size = useAvatarSelectionSize();
  const { setAvatarId, avatarId } = useAvatarSelectionContext();

  const renderItem = useCallback<ListRenderItem<DefaultAvatar>>(
    ({ item: { id, source } }) => {
      return (
        <Frame
          key={`avatar-${id}`}
          marginBottom="large"
          marginTop="large"
          style={{
            height: size,
            width: size,
            flex: 1 / 2,
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => setAvatarId(id)}
            style={{
              flex: 1,
              borderRadius: theme.constants.absoluteRadius,
            }}
          >
            {avatarId === id && (
              <View
                style={{
                  position: "absolute",
                  backgroundColor: theme.colors.primary,
                  width: size,
                  height: size,
                  borderRadius: theme.constants.absoluteRadius,
                  transform: [
                    {
                      scale: 1.1,
                    },
                  ],
                }}
              />
            )}
            {source ? (
              <Image
                source={{ uri: source }}
                resizeMode="cover"
                style={{
                  width: size,
                  height: size,
                  borderRadius: theme.constants.absoluteRadius,
                  overflow: "hidden",
                }}
              />
            ) : (
              <AvatarUploadButton />
            )}
          </Pressable>
        </Frame>
      );
    },
    [
      avatarId,
      setAvatarId,
      size,
      theme.colors.primary,
      theme.constants.absoluteRadius,
    ]
  );

  return (
    <Frame flex={1} justifyContent="flex-start" alignItems="center">
      <Frame
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        flex={1}
      >
        <FlatList
          scrollEnabled={false}
          data={data}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{
            flexGrow: 1 / 2,
            paddingHorizontal: theme.units.large,
            justifyContent: "center",
          }}
        />
      </Frame>
    </Frame>
  );
});

export { AvatarSelection };

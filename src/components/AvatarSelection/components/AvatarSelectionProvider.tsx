import React from "react";
import { useState, useCallback } from "react";
import { useQueryClient } from "react-query";
import { AvatarIds } from "../../../shared/avatars-list";
import { QueryKeys } from "../../../shared/QueryKeys";
import { useAvatar, useSelectAvatar } from "../../../storage/avatar";

const Context = React.createContext<{
  avatarId: AvatarIds;
  setAvatarId: (id: AvatarIds) => void;
  setSelectedPhoto: (photo: string) => void;
  photo: string | null;
  disabled: boolean;
  saveAvatar: () => void;
} | null>(null);

const AvatarSelectionProvider: React.FunctionComponent<{
  onSuccess?: () => void;
}> = function AvatarSelectionProvider({ children, onSuccess }) {
  const { data } = useAvatar();
  const [photo, setSelectedPhoto] = useState<string | null>(
    data?.avatarId === AvatarIds.__USER_PHOTO__ ? String(data.base64) : null
  );
  const [avatarId, setAvatarId] = useState<AvatarIds>(AvatarIds.Wynonna);
  const client = useQueryClient();
  const { mutate } = useSelectAvatar({
    onSuccess: () => {
      client.invalidateQueries(QueryKeys.GET_USER_AVATAR);
      onSuccess?.();
    },
  });

  const saveAvatar = useCallback(() => {
    if (avatarId === AvatarIds.__USER_PHOTO__ && photo) {
      return mutate({
        avatarId,
        base64: photo,
      });
    }
    return mutate({
      avatarId,
    });
  }, [avatarId, mutate, photo]);

  let disabled = true;
  if (avatarId !== AvatarIds.__USER_PHOTO__) {
    disabled = false;
  } else if (avatarId === AvatarIds.__USER_PHOTO__) {
    disabled = photo === null;
  }

  return (
    <Context.Provider
      value={{
        photo,
        setSelectedPhoto,
        disabled,
        saveAvatar,
        avatarId,
        setAvatarId,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { AvatarSelectionProvider, Context as AvatarSelectionContext };

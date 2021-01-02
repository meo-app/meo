import { Avatar01 } from "./Avatar01";
import React from "react";
import { Avatar02 } from "./Avatar02";
import { Avatar03 } from "./Avatar03";
import { Avatar04 } from "./Avatar04";

enum AvatarIds {
  __USER_PHOTO__ = "__USER_PHOTO__",
  Wynonna = "Wynonna",
  Eidothea = "Eidothea",
  Korinna = "Korinna",
  Jagoda = "Jagoda",
  Guistina = "Guistina",
  // Hrodwyn = "Hrodwyn",
  // Xifeng = "Xifeng",
  // Dagmar = "Dagmar",
  // Kaupana = "Kaupana"
  // Hippolyte = "Hippolyte"
  // Cvetka = "Cvetka"
  // Evulka = "Evulka"
  // Reah = "Reah"
}

interface DefaultAvatarsList {
  id: AvatarIds;
  node: React.ReactNode;
}

const AVATARS_LIST: DefaultAvatarsList[] = [
  {
    id: AvatarIds.Wynonna,
    node: <Avatar01 />,
  },
  {
    id: AvatarIds.Eidothea,
    node: <Avatar02 />,
  },
  {
    id: AvatarIds.Korinna,
    node: <Avatar03 />,
  },
  {
    id: AvatarIds.Jagoda,
    node: <Avatar04 />,
  },
  {
    id: AvatarIds.Guistina,
    node: <Avatar01 />,
  },
].filter((item, index, self) => {
  if (self.map((item) => item.id).indexOf(item.id) !== index) {
    console.error(
      `[AVATARS LIST] Found more than one avatar with the id ${item.id}. AVATAR_LIST should be unique`
    );
    return false;
  }

  return true;
});

export { AVATARS_LIST, AvatarIds };

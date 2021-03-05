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

interface DefaultAvatar {
  id: AvatarIds;
  source?: string;
}

const AVATARS_LIST: DefaultAvatar[] = [
  {
    id: AvatarIds.Wynonna,
    source: "https://loremflickr.com/500/500/cat?lock=1",
  },
  {
    id: AvatarIds.Eidothea,
    source: "https://loremflickr.com/500/500/cat?lock=2",
  },
  {
    id: AvatarIds.Korinna,
    source: "https://loremflickr.com/500/500/cat?lock=3",
  },
  {
    id: AvatarIds.Jagoda,
    source: "https://loremflickr.com/500/500/cat?lock=4",
  },
  {
    id: AvatarIds.Guistina,
    source: "https://loremflickr.com/500/500/cat?lock=5",
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

export { AVATARS_LIST, AvatarIds, DefaultAvatar };

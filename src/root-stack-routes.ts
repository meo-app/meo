enum RootStackRoutes {
  Tabs = "Tabs",
  Home = "Home",
  Create = "Create",
  Explore = "Explore",
  Placeholder = "Placeholder",
  Settings = "Settings",
  HashtagViewer = "HashtagViewer",
  PostDetails = "PostDetails",
  ChangeAvatar = "ChangeAvatar",
}

type RootStackParamList = {
  Tabs: undefined;
  Home: undefined;
  Create: undefined;
  Explore: undefined;
  Placeholder: undefined;
  Settings: undefined;
  HashtagViewer: { hashtag: string };
  PostDetails: { id: string };
  ChangeAvatar: undefined;
};

export { RootStackRoutes, RootStackParamList };

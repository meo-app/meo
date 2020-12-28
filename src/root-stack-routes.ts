enum RootStackRoutes {
  Tabs = "Tabs",
  Home = "Home",
  Create = "Create",
  Search = "Explore",
  Placeholder = "Placeholder",
  Settings = "Settings",
  HashtagViewer = "HashtagViewer",
}

type RootStackParamList = {
  Tabs: undefined,
  Home: undefined,
  Create: undefined,
  Search: undefined,
  Placeholder: undefined,
  Settings: undefined,
  HashtagViewer: { hashtag: string },
};

export { RootStackRoutes, RootStackParamList };
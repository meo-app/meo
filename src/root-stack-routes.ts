enum RootStackRoutes {
  Tabs = "Tabs",
  Home = "Home",
  Create = "Create",
  Explore = "Explore",
  SearchResutls = "SearchResults",
  Placeholder = "Placeholder",
  Settings = "Settings",
  HashtagViewer = "HashtagViewer",
}

type RootStackParamList = {
  Tabs: undefined;
  Home: undefined;
  Create: undefined;
  Explore: undefined;
  Placeholder: undefined;
  Settings: undefined;
  HashtagViewer: { hashtag: string };
  SearchResults: undefined;
};

export { RootStackRoutes, RootStackParamList };

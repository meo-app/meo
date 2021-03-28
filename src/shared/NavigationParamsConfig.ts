type NavigationParamsConfig = {
  Tabs: undefined;
  Home?: {
    resetScroll?: boolean;
  };
  Explore?: {
    resetScroll?: boolean;
  };
  Create: undefined;
  Placeholder: undefined;
  Settings: undefined;
  HashtagViewer: { hashtag: string };
  PostDetails: { id: string; editPostEnabled?: boolean };
  ChangeAvatar: undefined;
};

export { NavigationParamsConfig };

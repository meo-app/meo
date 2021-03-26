type NavigationParamsConfig = {
  Tabs: undefined;
  Home?: {
    resetScroll?: boolean;
  };
  Create: undefined;
  Explore?: {
    resetScroll?: boolean;
  };
  Placeholder: undefined;
  Settings: undefined;
  HashtagViewer: { hashtag: string };
  PostDetails: { id: string };
  ChangeAvatar: undefined;
};

export { NavigationParamsConfig };

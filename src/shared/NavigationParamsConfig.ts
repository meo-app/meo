type NavigationParamsConfig = {
  Tabs: undefined;
  Home?: {
    resetScroll?: boolean;
  };
  Explore?: {
    resetScroll?: boolean;
  };
  HashtagViewer: {
    hashtag: string;
    resetScroll?: boolean;
  };
  Create: {
    initialTextContent?: string;
    onSuccesRoute?: Extract<
      keyof NavigationParamsConfig,
      "HashtagViewer" | "Home"
    >;
  };
  PostDetails: { id: string };
  Placeholder: undefined;
  Settings: undefined;
  ChangeAvatar: undefined;
};

export { NavigationParamsConfig };

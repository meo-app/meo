import React, { RefObject, useRef, useContext, useState } from "react";
import { FlatList } from "react-native";
import { Post } from "../../api/Entities";
import { assert } from "../../utils/assert";

const Context = React.createContext<{
  postsRef: FlatList<Post> | null;
  setPostRef: (flatList: FlatList<Post> | null) => void;
  tabBarHeight?: number;
  setTabBarHeight: (value: number) => void;
} | null>(null);

function useHomeContext() {
  const context = useContext(Context);
  assert(context, "Home context not found");
  return context;
}

const HomeProvider: React.FunctionComponent = function HomeProvider({
  children,
}) {
  const ref = useRef<FlatList<Post> | null>(null);
  const [postsRef, setPostRef] = useState(ref.current);
  const [tabBarHeight, setTabBarHeight] = useState(0);
  return (
    <Context.Provider
      value={{ postsRef, setPostRef, tabBarHeight, setTabBarHeight }}
    >
      {children}
    </Context.Provider>
  );
};

export { HomeProvider, useHomeContext };

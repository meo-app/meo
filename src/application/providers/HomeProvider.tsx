import React, { RefObject, useRef, useContext } from "react";
import { FlatList } from "react-native";

const Context = React.createContext<{
  postsRef: RefObject<FlatList> | null;
}>({ postsRef: null });

const HomeProvider: React.FunctionComponent = function Foo({ children }) {
  const ref = useRef<FlatList | null>(null);
  return (
    <Context.Provider value={{ postsRef: ref }}>{children}</Context.Provider>
  );
};

function usePostsFlatList() {
  return useContext(Context);
}

export { HomeProvider, usePostsFlatList };

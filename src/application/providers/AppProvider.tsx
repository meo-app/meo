import React, { useContext, useState } from "react";
import { assert } from "../../shared/assert";

const Context = React.createContext<{
  tabBarHeight: number;
  setTabBarHeight: (value: number) => void;
} | null>(null);

function useAppContext() {
  const context = useContext(Context);
  assert(context, "Home context not found");
  return context;
}

const AppProvider: React.FunctionComponent = function AppProvider({
  children,
}) {
  const [tabBarHeight, setTabBarHeight] = useState(0);
  return (
    <Context.Provider value={{ tabBarHeight, setTabBarHeight }}>
      {children}
    </Context.Provider>
  );
};

export { AppProvider, useAppContext };

import React, { createContext, useContext, useState } from "react";
import { TextInputProps } from "react-native";
import { assert } from "../../utils/assert";

const Context = createContext<
  | ({
      isFocused: boolean;
      setIsFocused: (value: boolean) => void;
      term: string;
    } & Required<Pick<TextInputProps, "onChangeText">>)
  | null
>(null);

const SearchProvider: React.FunctionComponent = function SearchProvider({
  children,
}) {
  const [term, onChangeText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Context.Provider
      value={{
        term,
        onChangeText: onChangeText,
        isFocused,
        setIsFocused,
      }}
    >
      {children}
    </Context.Provider>
  );
};

function useSearchContext() {
  const context = useContext(Context);
  assert(context, "Could not find search context");
  return context;
}

export { SearchProvider, useSearchContext };

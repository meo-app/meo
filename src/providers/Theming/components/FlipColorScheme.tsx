import React from "react";
import { useColorScheme } from "react-native";
import { usePreferredColorSchemeQuery } from "../../../hooks/use-preferred-color-scheme-query";
import { ThemeProvider } from "../Theming";

const FlipColorScheme: React.FunctionComponent = function FlipColorScheme({
  children,
}) {
  const { data: preferredColorScheme } = usePreferredColorSchemeQuery();
  const systemColorScheme = useColorScheme();

  return (
    <ThemeProvider
      handleStatusBar={false}
      {...(systemColorScheme && {
        forceColorSchemeTo: systemColorScheme === "dark" ? "light" : "dark",
      })}
      {...(preferredColorScheme !== "system" && {
        forceColorSchemeTo: preferredColorScheme === "dark" ? "light" : "dark",
      })}
    >
      {children}
    </ThemeProvider>
  );
};

export { FlipColorScheme };

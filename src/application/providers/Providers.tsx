import React from "react";
import { AppearanceProvider } from "react-native-appearance";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider } from "./SQLiteProvider";
import { ThemeProvider } from "./Theming";

const Providers: React.FunctionComponent = function Providers({ children }) {
  return (
    <SQLiteProvider>
      <AppearanceProvider>
        <SafeAreaProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SafeAreaProvider>
      </AppearanceProvider>
    </SQLiteProvider>
  );
};

export { Providers };

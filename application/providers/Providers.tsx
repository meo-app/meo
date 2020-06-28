import React, { Children } from "react";
import { AppearanceProvider } from "react-native-appearance";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./Theming";
import { SQLiteProvider } from "./SQLiteProvider";

const Providers: React.FunctionComponent = function Providers({ children }) {
  return (
    <SQLiteProvider>
      <AppearanceProvider>
        <NavigationContainer>
          <SafeAreaProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </SafeAreaProvider>
        </NavigationContainer>
      </AppearanceProvider>
    </SQLiteProvider>
  );
};

export { Providers };

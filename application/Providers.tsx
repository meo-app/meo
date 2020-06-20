import React, { Children } from "react";
import { AppearanceProvider } from "react-native-appearance";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./Theming";

const Providers: React.FunctionComponent = function Providers({ children }) {
  return (
    <AppearanceProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </AppearanceProvider>
  );
};

export { Providers };

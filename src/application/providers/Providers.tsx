import React from "react";
import { IntlProvider } from "react-intl";
import { AppearanceProvider } from "react-native-appearance";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider } from "./SQLiteProvider";
import { ThemeProvider } from "./Theming";
import { NavigationContainer } from "@react-navigation/native";

const Providers: React.FunctionComponent = function Providers({ children }) {
  // TODO: retrieve user locale?
  return (
    <IntlProvider locale="en">
      <SQLiteProvider>
        <NavigationContainer>
          <AppearanceProvider>
            <SafeAreaProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </SafeAreaProvider>
          </AppearanceProvider>
        </NavigationContainer>
      </SQLiteProvider>
    </IntlProvider>
  );
};

export { Providers };

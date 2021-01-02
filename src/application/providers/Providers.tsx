import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import React from "react";
import { IntlProvider } from "react-intl";
import { AppearanceProvider } from "react-native-appearance";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeProvider } from "./HomeProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { SearchProvider } from "./SearchProvider";
import { SQLiteProvider } from "./SQLiteProvider";
import { ThemeProvider, useTheme } from "./Theming";

const Providers: React.FunctionComponent = function Providers({ children }) {
  // TODO: retrieve user locale?
  return (
    <IntlProvider locale="en">
      <HomeProvider>
        <SearchProvider>
          <SQLiteProvider>
            <ReactQueryProvider>
              <AppearanceProvider>
                <SafeAreaProvider>
                  <ThemeProvider>
                    <CustomNavigationContainer>
                      {children}
                    </CustomNavigationContainer>
                  </ThemeProvider>
                </SafeAreaProvider>
              </AppearanceProvider>
            </ReactQueryProvider>
          </SQLiteProvider>
        </SearchProvider>
      </HomeProvider>
    </IntlProvider>
  );
};
const CustomNavigationContainer: React.FunctionComponent = function CustomNavigationContainer({
  children,
}) {
  const theme = useTheme();
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors.background,
        },
      }}
    >
      {children}
    </NavigationContainer>
  );
};

export { Providers };

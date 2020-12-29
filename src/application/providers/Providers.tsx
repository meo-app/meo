import React from "react";
import { IntlProvider } from "react-intl";
import { AppearanceProvider } from "react-native-appearance";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider } from "./SQLiteProvider";
import { ThemeProvider, useTheme } from "./Theming";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { HomeProvider } from "./HomeProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";

const Providers: React.FunctionComponent = function Providers({ children }) {
  // TODO: retrieve user locale?
  return (
    <IntlProvider locale="en">
      <HomeProvider>
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

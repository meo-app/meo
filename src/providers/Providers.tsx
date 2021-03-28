import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import React from "react";
import { IntlProvider } from "react-intl";
// TODO: depreacte react-native-appearance in favor or RN
import { AppearanceProvider } from "react-native-appearance";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "./AppProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { SQLiteProvider } from "./SQLiteProvider";
import { ThemeProvider, useTheme } from "./Theming";

const Providers: React.FunctionComponent = function Providers({ children }) {
  // TODO: retrieve user locale?
  return (
    <IntlProvider locale="en">
      <AppProvider>
        <SQLiteProvider>
          <ReactQueryProvider>
            <AppearanceProvider>
              <SafeAreaProvider>
                <ThemeProvider>
                  <CustomNavigationContainer>
                    <ActionSheetProvider>{children}</ActionSheetProvider>
                  </CustomNavigationContainer>
                </ThemeProvider>
              </SafeAreaProvider>
            </AppearanceProvider>
          </ReactQueryProvider>
        </SQLiteProvider>
      </AppProvider>
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

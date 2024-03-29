import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import React from "react";
import { IntlProvider } from "react-intl";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "./AppProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { SQLiteProvider } from "./SQLiteProvider";
import { useTheme } from "./Theming/hooks/use-theme";
import { ThemeProvider } from "./Theming/Theming";

const Providers: React.FunctionComponent = function Providers({ children }) {
  return (
    <IntlProvider locale="en">
      <AppProvider>
        <SQLiteProvider>
          <ReactQueryProvider>
            <SafeAreaProvider>
              <ThemeProvider>
                <CustomNavigationContainer>
                  <ActionSheetProvider>{children}</ActionSheetProvider>
                </CustomNavigationContainer>
              </ThemeProvider>
            </SafeAreaProvider>
          </ReactQueryProvider>
        </SQLiteProvider>
      </AppProvider>
    </IntlProvider>
  );
};

/**
 * Defines a custom navigatio container so we will set the default background color
 * to be the same as set on the runtime theme
 * */
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

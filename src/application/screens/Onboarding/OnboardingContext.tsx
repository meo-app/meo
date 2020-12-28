import {
  NavigationContainerRef,
  EventListenerCallback,
  NavigationState,
  NavigationContainer,
  DefaultTheme,
} from "@react-navigation/native";
import React, { useContext, useRef, useState, useEffect } from "react";
import { useQueryClient } from "react-query";
import { QueryIds } from "../../../api/QueryIds";

export enum RootStackRoutes {
  OnboardingSlider = "OnboardingSlider",
  InsertName = "InsertName",
  AvatarSelection = "AvatarSelection",
}

const Context = React.createContext<{
  index: number;
  next?: () => void;
  back?: () => void;
  finalize: () => void;
} | null>(null);

function useOnboardingContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("Onboarding context not found ");
  }

  return context;
}

const routes = [
  RootStackRoutes.OnboardingSlider,
  RootStackRoutes.InsertName,
  RootStackRoutes.AvatarSelection,
];

const OnboardingNavigationProvider: React.FunctionComponent = function OnboardingNavigationProvider({
  children,
}) {
  const navigationRef = useRef<NavigationContainerRef>(null);
  const [index, setIndex] = useState(0);
  const client = useQueryClient();
  useEffect(() => {
    const current = navigationRef.current;
    const listener: EventListenerCallback<
      { state: { data: { state: NavigationState } } },
      "state"
    > = (state) => setIndex(state.data.state.index);
    current?.addListener("state", listener);
    return () => current?.removeListener("state", listener);
  }, []);

  return (
    <Context.Provider
      value={{
        index,
        finalize: () => {
          client.refetchQueries([QueryIds.hasSeenOnboarding]);
        },
        ...(index + 1 <= routes.length - 1 && {
          next: () => {
            navigationRef.current?.navigate(routes[index + 1]);
          },
        }),
        ...(Boolean(index > 0) && {
          back: () => {
            navigationRef.current?.goBack();
          },
        }),
      }}
    >
      <NavigationContainer
        ref={navigationRef}
        independent
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: "transparent",
          },
        }}
      >
        {children}
      </NavigationContainer>
    </Context.Provider>
  );
};

export { OnboardingNavigationProvider, useOnboardingContext };

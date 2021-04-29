import {
  DefaultTheme,
  EventListenerCallback,
  NavigationContainer,
  NavigationContainerEventMap,
  NavigationContainerRef,
} from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useAvatarSelectionContext } from "../../components/AvatarSelection/hooks/use-avatar-selection-context";
import { QueryKeys } from "../../shared/QueryKeys";

type OnboardingParamsConfig = {
  OnboardingSlider: undefined;
  AvatarSelection: undefined;
};

const Context = React.createContext<{
  index: number;
  next?: () => void;
  back?: () => void;
  finalize: () => void;
  disabled: boolean;
} | null>(null);

function useOnboardingContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("Onboarding context not found ");
  }

  return context;
}

/**
 * Routes should contain the order of onboarding steps so that next/back takes to the correct screen
 * TODO: if onboarding will only be two screens remove this and simplify
 */
const routes: (keyof OnboardingParamsConfig)[] = [
  "OnboardingSlider",
  "AvatarSelection",
];

const OnboardingNavigationProvider: React.FunctionComponent = function OnboardingNavigationProvider({
  children,
}) {
  const { disabled, saveAvatar } = useAvatarSelectionContext();
  const navigationRef = useRef<NavigationContainerRef>(null);
  const [index, setIndex] = useState(0);
  const client = useQueryClient();
  useEffect(() => {
    const current = navigationRef.current;
    const listener: EventListenerCallback<
      NavigationContainerEventMap,
      "state"
    > = (event) => {
      setIndex(event.data.state?.index || 0);
    };
    current?.addListener("state", listener);
    return () => current?.removeListener("state", listener);
  }, []);

  return (
    <Context.Provider
      value={{
        index,
        disabled,
        finalize: () => {
          saveAvatar();
          client.refetchQueries([QueryKeys.HAS_SEEN_ONBOARDING]);
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
          colors: { ...DefaultTheme.colors, background: "transparent" },
        }}
      >
        {children}
      </NavigationContainer>
    </Context.Provider>
  );
};

export {
  OnboardingNavigationProvider,
  useOnboardingContext,
  OnboardingParamsConfig,
};

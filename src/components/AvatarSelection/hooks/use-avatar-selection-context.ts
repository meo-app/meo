import { useContext } from "react";
import assert from "assert";
import { AvatarSelectionContext } from "../components/AvatarSelectionProvider";

function useAvatarSelectionContext() {
  const context = useContext(AvatarSelectionContext);
  assert(context, "Avatar Context not found");
  return context;
}

export { useAvatarSelectionContext };

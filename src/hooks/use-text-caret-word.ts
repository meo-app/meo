import { useState, useEffect, useCallback } from "react";
import { getTextCaretWord } from "../shared/hashtag-utils";
import {
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
} from "react-native";

function useTextCaretWord({ text }: { text: string }) {
  const [selection, setSelection] = useState<
    TextInputSelectionChangeEventData["selection"]
  >({
    end: 0,
    start: 0,
  });

  const [caretWord, setCaretWord] = useState<ReturnType<
    typeof getTextCaretWord
  > | null>(null);

  useEffect(() => {
    setCaretWord(getTextCaretWord({ text, selection }));
  }, [selection, text]);

  const onSelectionChange = useCallback(
    (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) =>
      setSelection(event.nativeEvent.selection),
    []
  );

  return {
    onSelectionChange,
    caretWord,
  };
}

export { useTextCaretWord };

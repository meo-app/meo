import { TextInputSelectionChangeEventData } from "react-native";

const HASHTAG_REGEX = /(#\w+)/g;

const extractHashtags = (text: string) =>
  text.split(HASHTAG_REGEX).filter((item) => /#/.test(item));

/**
 * Finds the word that the text input is currently focused on
 */
function getTextCaretWord({
  text,
  selection: { start, end },
}: {
  text: string;
} & Pick<TextInputSelectionChangeEventData, "selection">) {
  let startIndex = 0;
  let endIndex = 0;
  // If there is only one word on the text return it immediately
  if (text.split(" ").length === 1) {
    return {
      word: text,
      startIndex,
      endIndex,
    };
  }

  const isFocusedOnEnd =
    start === end && start === text.length && Boolean(text[start]);

  /**
   * If the caret is at the end of the input (`start` and `end` should be the same number)
   * and the last character of the text is not empty, we need to  decrease the selection index by -1
   */
  const index = start - (isFocusedOnEnd ? 1 : 0);

  let word = "";

  /**
   * Collect all characters of the word from the current selection index forwards
   * until we find a space
   */
  for (let i = index; i <= text.length; i++) {
    const character = text[i];
    if (character && character !== " ") {
      word += character;
    } else {
      endIndex = i - 1;
      break;
    }
  }

  /**
   * Collect all characters of the word from the current selection index backwords
   * until we find a space
   */
  for (let i = index - 1; i > 0; i--) {
    const character = text[i];
    if (character && character !== " ") {
      word = character + word;
    } else {
      startIndex = i + 1;
      break;
    }
  }

  return {
    word,
    startIndex,
    endIndex,
  };
}

export { HASHTAG_REGEX, extractHashtags, getTextCaretWord };

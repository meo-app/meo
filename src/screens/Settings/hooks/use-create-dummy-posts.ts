import { LoremIpsum } from "lorem-ipsum";
import { useMutation } from "react-query";
import { useCreatePost } from "../../../hooks/use-create-post";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

const DUMMY_POSTS_SIZE = 100;

function useCreatDummyPosts(times: number = DUMMY_POSTS_SIZE) {
  const { mutateAsync } = useCreatePost();
  return useMutation(() =>
    Promise.all(
      [...Array(times)]
        .map(() => lorem.generateParagraphs(1))
        .map((text) =>
          mutateAsync({
            text: text
              .split(" ")
              .map((word) => (Math.random() <= 0.5 ? `#${word}` : word))
              .join(" "),
          })
        )
    )
  );
}

export { useCreatDummyPosts };

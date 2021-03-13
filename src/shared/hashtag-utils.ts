const HASHTAG_REGEX = /(#\w+)/g;

const extractHashtags = (text: string) =>
  text.split(HASHTAG_REGEX).filter((item) => /#/.test(item));

export { HASHTAG_REGEX, extractHashtags };

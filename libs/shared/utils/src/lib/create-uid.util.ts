const MIN_LENGTH = 6;
const CHARACTERS_WITHOUT_NUMBER =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const CHARACTERS_WITH_NUMBER =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const createUID = (length?: number) => {
  length = !length || length < MIN_LENGTH ? MIN_LENGTH : length;

  // must start with a letter
  let result = CHARACTERS_WITHOUT_NUMBER.charAt(
    Math.floor(Math.random() * CHARACTERS_WITHOUT_NUMBER.length),
  );
  for (let i = 1; i < length; i++) {
    result += CHARACTERS_WITH_NUMBER.charAt(
      Math.floor(Math.random() * CHARACTERS_WITH_NUMBER.length),
    );
  }
  return result;
};

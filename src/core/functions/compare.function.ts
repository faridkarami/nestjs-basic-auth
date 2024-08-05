import { timingSafeEqual } from 'crypto';

export const compare = (userInput: string, secret: string): boolean => {
  const userInputLength = Buffer.byteLength(userInput);
  const secretLength = Buffer.byteLength(secret);

  const userInputBuffer = Buffer.alloc(userInputLength, 0, 'utf8');
  userInputBuffer.write(userInput);
  const secretBuffer = Buffer.alloc(secretLength, 0, 'utf8');
  secretBuffer.write(secret);

  return !!(
    timingSafeEqual(userInputBuffer, secretBuffer) &&
    userInputLength === secretLength
  );
};

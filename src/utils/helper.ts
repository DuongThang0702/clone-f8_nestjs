import * as bcrypt from 'bcrypt';

export const hashSomthing = async (rawString: string): Promise<string> => {
  const salt = 10;
  const hash = await bcrypt.hash(rawString, salt);
  return hash;
};
export const compareSomething = async (
  rawString: string,
  hash: string,
): Promise<boolean> => await bcrypt.compare(rawString, hash);

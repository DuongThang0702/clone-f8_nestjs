import * as bcrypt from 'bcrypt';
export const hashSomthing = async (rawString: string): Promise<string> => {
  const salt = 10;
  const hash = await bcrypt.hash(rawString, salt);
  return hash;
};

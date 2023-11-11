import * as md5 from 'md5';
export const encipherPassword = (password: string): string => {
  return md5(password);
};

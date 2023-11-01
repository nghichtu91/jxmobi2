import { createHash } from 'node:crypto';

export const CreateMD5 = (str: string) =>
  createHash('md5').update(str).digest('hex');

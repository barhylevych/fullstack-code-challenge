import * as REPOS from '../repos';
import type { USER } from '../models';

export async function getAll(): Promise<USER.IUser[]> {
  return REPOS.USERS.getAll();
}

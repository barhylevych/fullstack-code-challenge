import { User, IUser } from '../models/user';
import database from './_database';

export async function getAll(): Promise<IUser[]> {
  const { rows } = await database.query<IUser & Record<string, unknown>>(
    'SELECT * FROM users;',
  );

  return rows.map((row) => User.new(({
    ...row,
    createdAt: row.created_at as Date,
  })));
}


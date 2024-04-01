import { ANSWER } from '../models';
import database from './_database';

export async function getAll(): Promise<ANSWER.IAnswer[]> {
  const { rows } = await database.query<ANSWER.IAnswer & Record<string, unknown>>(
    'SELECT * FROM answers;',
  );
  return rows.map((row) => ANSWER.Answer.new({
    ...row,
    createdAt: row.created_at as Date,
    editedAt: row.edited_at as Date,
    userId: row.user_id as string,
    questionId: row.question_id as string,
  }));
}

export async function getAllByUserId(userId: ANSWER.IAnswer['userId']): Promise<ANSWER.IAnswer[]> {
  const { rows } = await database.query<ANSWER.IAnswer & Record<string, unknown>>(
    'SELECT * FROM answers where user_id = $1;', [userId],
  );

  return rows.map((row) => ANSWER.Answer.new({
    ...row,
    createdAt: row.created_at as Date,
    editedAt: row.edited_at as Date,
    userId: row.user_id as string,
    questionId: row.question_id as string,
  }));
}

export async function create(answer: Pick<ANSWER.IAnswer, 'message' | 'userId' | 'questionId'>): Promise<ANSWER.IAnswer> {
  const { rows: [row] } = await database.query<ANSWER.IAnswer & Record<string, unknown>>(
    'INSERT INTO answers(message, user_id, question_id) VALUES ($1, $2, $3) RETURNING *;',
    [answer.message, answer.userId, answer.questionId],
  );

  return ANSWER.Answer.new({
    ...row,
    createdAt: row.created_at as Date,
    editedAt: row.edited_at as Date,
    userId: row.user_id as string,
    questionId: row.question_id as string,
  });
}

export async function update(answer: Pick<ANSWER.IAnswer, 'message' | 'id'>): Promise<ANSWER.IAnswer> {
  const { rows: [row] } = await database.query<ANSWER.IAnswer & Record<string, unknown>>(
    'UPDATE answers SET message = $2, edited_at = now() WHERE id = $1 RETURNING *;',
    [answer.id, answer.message],
  );

  return ANSWER.Answer.new({
    ...row,
    createdAt: row.created_at as Date,
    editedAt: row.edited_at as Date,
    userId: row.user_id as string,
    questionId: row.question_id as string,
  });
}

export async function drop(answer: Pick<ANSWER.IAnswer, 'id'>): Promise<void> {
  await database.query<ANSWER.IAnswer & Record<string, unknown>>(
    'DELETE FROM answers where id = $1;',
    [answer.id],
  );
}



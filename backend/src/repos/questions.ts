import { Question, IQuestion } from '../models/question';
import database from './_database';

export async function getAll(): Promise<IQuestion[]> {
  const { rows } = await database.query<IQuestion & Record<string, unknown>>(
    'SELECT * FROM questions;',
  );
  return rows.map((row) => Question.new({
    ...row,
    createdAt: row.created_at as Date,
    editedAt: row.edited_at as Date,
    userId: row.user_id as string,
  }));
}

export async function create(question: Pick<IQuestion, 'description' | 'title' | 'userId'>): Promise<IQuestion> {
  const { rows: [row] } = await database.query<IQuestion & Record<string, unknown>>(
    'INSERT INTO questions(title, description, user_ID) VALUES ($1, $2, $3) RETURNING *;',
    [question.title, question.description, question.userId],
  );

  return Question.new({
    ...row,
    createdAt: row.created_at as Date,
    editedAt: row.edited_at as Date,
    userId: row.user_id as string,
  });
}

export async function update(question: Pick<IQuestion, 'description' | 'title' | 'id'>): Promise<IQuestion> {
  const { rows: [row] } = await database.query<IQuestion & Record<string, unknown>>(
    'UPDATE questions SET title = $2, description = $3, edited_at = now() WHERE id = $1 RETURNING *;',
    [question.id, question.title, question.description],
  );

  return Question.new({
    ...row,
    createdAt: row.created_at as Date,
    editedAt: row.edited_at as Date,
    userId: row.user_id as string,
  });
}

export async function drop(question: Pick<IQuestion, 'id'>): Promise<void> {
  await database.query<IQuestion & Record<string, unknown>>(
    'DELETE FROM questions where id = $1;',
    [question.id],
  );
}



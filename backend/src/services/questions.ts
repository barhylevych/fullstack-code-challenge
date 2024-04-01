import * as REPOS from '../repos';
import type { QUESTION } from '../models';

export async function getAll(): Promise<QUESTION.IQuestion[]> {
  return REPOS.QUESTIONS.getAll();
}

export async function get(id: QUESTION.IQuestion['id']): Promise<QUESTION.IQuestion> {
  return REPOS.QUESTIONS.get(id);
}

export async function create(question: QUESTION.IQuestion): Promise<QUESTION.IQuestion> {
  return REPOS.QUESTIONS.create(question);
}

export async function update(question: QUESTION.IQuestion): Promise<QUESTION.IQuestion> {
  return REPOS.QUESTIONS.update(question);
}

export async function drop(question: QUESTION.IQuestion): Promise<void> {
  return REPOS.QUESTIONS.drop(question);
}

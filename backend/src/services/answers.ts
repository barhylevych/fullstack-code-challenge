import * as REPOS from '../repos';
import type { ANSWER } from '../models';

export async function getAll(): Promise<ANSWER.IAnswer[]> {
  return REPOS.ANSWERS.getAll();
}

export async function get(id: ANSWER.IAnswer['id']): Promise<ANSWER.IAnswer> {
  return REPOS.ANSWERS.get(id);
}

export async function getAllByUserId(id: ANSWER.IAnswer['userId']): Promise<ANSWER.IAnswer[]> {
  return REPOS.ANSWERS.getAllByUserId(id);
}

export async function create(question: ANSWER.IAnswer): Promise<ANSWER.IAnswer> {
  return REPOS.ANSWERS.create(question);
}

export async function update(question: ANSWER.IAnswer): Promise<ANSWER.IAnswer> {
  return REPOS.ANSWERS.update(question);
}

export async function drop(question: ANSWER.IAnswer): Promise<void> {
  return REPOS.ANSWERS.drop(question);
}

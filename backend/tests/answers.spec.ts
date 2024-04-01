/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, max-len */

import supertest from 'supertest';
import zod from 'zod';

import app from '../src';
import {HTTPS_STATUS_CODES} from '../src/constants';
import * as MODELS from '../src/models';
import database from '../src/repos/_database';

const agent = supertest.agent(app);
const answerValidationSchema = zod.object({
  id: zod.string().uuid(),
  message: zod.string(),
  questionId: zod.string().uuid(),
  userId: zod.string().uuid(),
  createdAt: zod.coerce.date(),
  editedAt: zod.coerce.date(),
});

describe('Answers', () => {
  const answersIdsToDelete: string[] = [];
  const questionIdsToDelete: string[] = [];
  let user: MODELS.USER.IUser | null = null;
  let question: MODELS.QUESTION.IQuestion | null = null;

  beforeAll(async () => {
    const { body: [_user] } = await agent.get('/api/users');
    const { body: _question } = await agent.post('/api/questions').send({
      title: 'What is the capital of France?',
      description: 'I need to know the capital of France.',
      userId: _user.id,
    });
    user = _user;
    question = _question;

  });

  afterAll(async () => {
    await database.transaction(async (client) => {
      await client.query('DELETE FROM answers where id = ANY($1::uuid[]);', [answersIdsToDelete]);
      await client.query('DELETE FROM answers where id = ANY($1::uuid[]);', [questionIdsToDelete]);
    });
  });

  describe('POST', () => {
    it('success creation', async () => {
      const data = {
        message: 'I think it is Paris.',
        userId: user?.id,
        questionId: question?.id,
      };

      const answerResponse = await agent.post('/api/answers').send(data);

      expect(answerResponse.status).toBe(HTTPS_STATUS_CODES.OK);
      expect(answerValidationSchema.safeParse(answerResponse.body).success).toBeTruthy();
      expect({...answerResponse.body, ...data }).toMatchObject(answerResponse.body);

      answersIdsToDelete.push(answerResponse.body.id);
    });

    it('creation failed cause send body is not ok', async () => {
      const data = {
        title: 'What is the capital of France?',
        userId: user?.id,
      };

      const answerResponse = await agent.post('/api/answers').send(data);
      expect(answerResponse.status).toBe(HTTPS_STATUS_CODES.BAD_REQUEST);
      expect(answerResponse.body).toMatchObject({ error: 'NOT_VALID_BODY' });
    });
  });

  describe('GET', () => {
    it('Success', async () => {
      const response = await agent.get('/api/answers');

      expect(response.status).toBe(HTTPS_STATUS_CODES.OK);
      expect(answerValidationSchema.array().safeParse(response.body).success).toBeTruthy();
    });
  });

  describe('PUT', () => {
    it('Success', async () => {
      const { body: [answer] } = await agent.get('/api/answers');

      const data = {
        message: 'Maybe it is Paris.',
        id: answer?.id,
      };

      const answerResponse = await agent.put('/api/answers').send(data);

      expect(answerResponse.status).toBe(HTTPS_STATUS_CODES.OK);
      expect(answerValidationSchema.safeParse(answerResponse.body).success).toBeTruthy();
      expect({...answerResponse.body, ...data }).toMatchObject(answerResponse.body);
      expect(answer.editedAt).not.toBe(answerResponse.body.editedAt);
    });

    it('Lost one required param', async () => {
      const data = {
        message: 'IDK.',
      };

      const answerResponse = await agent.put('/api/answers').send(data);

      expect(answerResponse.status).toBe(HTTPS_STATUS_CODES.BAD_REQUEST);
      expect(answerValidationSchema.safeParse(answerResponse.body).success).toBeFalsy();
    });

    it('Update with wrong id', async () => {
      const data = {
        message: 'IDK.',
        id: 'wrong_id',
      };

      const answerResponse = await agent.put('/api/answers').send(data);

      expect(answerResponse.status).toBe(HTTPS_STATUS_CODES.BAD_REQUEST);
      expect(answerValidationSchema.safeParse(answerResponse.body).success).toBeFalsy();
    });
  });

  describe('DELETE', () => {
    it('Success', async () => {
      const { body: [answer] } = await agent.get('/api/answers');

      const answerResponse = await agent.delete('/api/answers/' + answer?.id)

      expect(answerResponse.status).toBe(HTTPS_STATUS_CODES.OK);
      expect(answerResponse.body).toMatchObject({ success: true });
    });
  });
});

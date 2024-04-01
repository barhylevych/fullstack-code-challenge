/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, max-len */

import supertest from 'supertest';
import zod from 'zod';

import app from '../src';
import {HTTPS_STATUS_CODES} from '../src/constants';
import database from '../src/repos/_database';

const agent = supertest.agent(app);
const questionValidationSchema = zod.object({
  id: zod.string(),
  title: zod.string(),
  description: zod.string(),
  userId: zod.string(),
  createdAt: zod.coerce.date(),
  editedAt: zod.coerce.date(),
});

describe('Questions', () => {

  afterAll(async () => {
    await database.transaction(async (client) => {
      await client.query('DELETE FROM questions where true;');
    });
  });

  describe('POST', () => {
    it('success creation', async () => {
      const { body: [user] } = await agent.get('/api/users');

      const data = {
        title: 'What is the capital of France?',
        description: 'I need to know the capital of France.',
        userId: user?.id,
      };

      const questionResponse = await agent.post('/api/questions').send(data);

      expect(questionResponse.status).toBe(HTTPS_STATUS_CODES.OK);
      expect(questionValidationSchema.safeParse(questionResponse.body).success).toBeTruthy();
      expect({...questionResponse.body, ...data }).toMatchObject(questionResponse.body);
    });

    it('creation failed cause send body is not ok', async () => {
      const { body: [user] } = await agent.get('/api/users');

      const data = {
        title: 'What is the capital of France?',
        userId: user?.id,
      };

      const questionResponse = await agent.post('/api/questions').send(data);
      expect(questionResponse.status).toBe(HTTPS_STATUS_CODES.BAD_REQUEST);
      expect(questionResponse.body).toMatchObject({ error: 'NOT_VALID_BODY' });
    });
  });

  describe('GET', () => {
    it('Success', async () => {
      const response = await agent.get('/api/questions');

      expect(response.status).toBe(HTTPS_STATUS_CODES.OK);
      expect(questionValidationSchema.array().safeParse(response.body).success).toBeTruthy();
    });
  });

  describe('PUT', () => {
    it('Success', async () => {
      const { body: [question] } = await agent.get('/api/questions');

      const data = {
        title: 'Where is France?',
        description: 'I need to know.',
        id: question?.id,
      };

      const questionResponse = await agent.put('/api/questions').send(data);

      expect(questionResponse.status).toBe(HTTPS_STATUS_CODES.OK);
      expect(questionValidationSchema.safeParse(questionResponse.body).success).toBeTruthy();
      expect({...questionResponse.body, ...data }).toMatchObject(questionResponse.body);
      expect(question.editedAt).not.toBe(questionResponse.body.editedAt);
    });

    it('Lost one required param', async () => {
      const data = {
        title: 'Where is France?',
        description: 'I need to know.',
      };

      const questionResponse = await agent.put('/api/questions').send(data);

      expect(questionResponse.status).toBe(HTTPS_STATUS_CODES.BAD_REQUEST);
      expect(questionValidationSchema.safeParse(questionResponse.body).success).toBeFalsy();
    });

    it('Update with wrong id', async () => {
      const data = {
        title: 'Where is France?',
        description: 'I need to know.',
        id: 'wrong_id',
      };

      const questionResponse = await agent.put('/api/questions').send(data);

      expect(questionResponse.status).toBe(HTTPS_STATUS_CODES.BAD_REQUEST);
      expect(questionValidationSchema.safeParse(questionResponse.body).success).toBeFalsy();
    });
  });

  describe('DELETE', () => {
    it('Success', async () => {
      const { body: [question] } = await agent.get('/api/questions');

      const data = {
        id: question?.id,
      };

      const questionResponse = await agent.delete('/api/questions').send(data);

      expect(questionResponse.status).toBe(HTTPS_STATUS_CODES.OK);
      expect(questionResponse.body).toMatchObject({ success: true });
    });
  });
});

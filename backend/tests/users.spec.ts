/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, max-len */
import supertest from 'supertest';
import zod from 'zod';

import app from '../src';
import {HTTPS_STATUS_CODES} from '../src/constants';

const agent = supertest.agent(app);

describe('Users', () => {

  it('GET success', (done) => {
    agent.get('/api/users').then((response) => {
      expect(response.status).toBe(HTTPS_STATUS_CODES.OK);

      const schema = zod.object({
        id: zod.string(),
        name: zod.string(),
        createdAt: zod.coerce.date(),
      }).array();

      expect(schema.safeParse(response.body).success).toBeTruthy();
      done();
    });
  });
});

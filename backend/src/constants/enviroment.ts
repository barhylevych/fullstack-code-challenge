import zod from 'zod';

const ENV = zod.object({
  NODE_ENV: zod.enum(['development', 'production', 'test']),
  PORT: zod.coerce.number(),
  PGSQL_USER: zod.string(),
  PGSQL_PASSWORD: zod.string(),
  PGSQL_HOST: zod.string(),
  PGSQL_PORT: zod.coerce.number(),
  PGSQL_DATABASE: zod.string(),
}).parse(process.env);

export default ENV;


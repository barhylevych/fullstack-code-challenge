import {Router} from 'express';
import zod from 'zod';
import * as SERVICES from '../services';
import Http_status_codes from '../constants/http_status_codes';
import {RouteError} from '../other/classes';
import { ANSWER } from '../models';

const answersRouter = Router();

answersRouter.get('/', async (_, res) => {
  const answers = await SERVICES.ANSWERS.getAll();
  return res.status(Http_status_codes.OK).json(answers);
});

answersRouter.get('/user/:userId', async (req, res) => {
  const {success} = zod.object({
    userId: zod.string().uuid(),
  }).safeParse(req.params);

  if (!success) throw new RouteError(Http_status_codes.BAD_REQUEST, 'NOT_VALID_PARAMS');

  const answers = await SERVICES.ANSWERS.getAllByUserId(req.params.userId);
  return res.status(Http_status_codes.OK).json(answers);
});

answersRouter.post('/', async (req, res) => {
  const {success} = zod.object({
    message: zod.string(),
    userId: zod.string().uuid(),
    questionId: zod.string(),
  }).safeParse(req.body);

  if (!success) throw new RouteError(Http_status_codes.BAD_REQUEST, 'NOT_VALID_BODY');

  const newQuestion = await SERVICES.ANSWERS.create(req.body as ANSWER.IAnswer);
  return res.status(Http_status_codes.OK).json(newQuestion);
});

answersRouter.put('/', async (req, res) => {
  const {success} = zod.object({
    id: zod.string().uuid(),
    message: zod.string(),
  }).safeParse(req.body);

  if (!success) throw new RouteError(Http_status_codes.BAD_REQUEST, 'NOT_VALID_BODY');

  const updatedQuestion = await SERVICES.ANSWERS.update(req.body as ANSWER.IAnswer);
  return res.status(Http_status_codes.OK).json(updatedQuestion);
});

answersRouter.delete('/', async (req, res) => {
  const {success} = zod.object({
    id: zod.string().uuid(),
  }).safeParse(req.body);

  if (!success) throw new RouteError(Http_status_codes.BAD_REQUEST, 'NOT_VALID_BODY');

  await SERVICES.ANSWERS.drop(req.body as ANSWER.IAnswer);
  return res.status(Http_status_codes.OK).json({ success: true });
});

export default answersRouter;

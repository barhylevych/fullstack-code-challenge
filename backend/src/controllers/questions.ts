import {Router} from 'express';
import zod from 'zod';
import * as SERVICES from '../services';
import Http_status_codes from '../constants/http_status_codes';
import {RouteError} from '../other/classes';
import {IQuestion} from '../models/question';

const questionsRouter = Router();

questionsRouter.get('/', async (_, res) => {
  const questions = await SERVICES.QUESTIONS.getAll();
  return res.status(Http_status_codes.OK).json(questions);
});

questionsRouter.post('/', async (req, res) => {
  const {success} = zod.object({
    title: zod.string(),
    description: zod.string(),
    userId: zod.string().uuid(),
  }).safeParse(req.body);

  if (!success) throw new RouteError(Http_status_codes.BAD_REQUEST, 'NOT_VALID_BODY');

  const newQuestion = await SERVICES.QUESTIONS.create(req.body as IQuestion);
  return res.status(Http_status_codes.OK).json(newQuestion);
});

questionsRouter.put('/', async (req, res) => {
  const {success} = zod.object({
    id: zod.string().uuid(),
    title: zod.string(),
    description: zod.string(),
  }).safeParse(req.body);

  if (!success) throw new RouteError(Http_status_codes.BAD_REQUEST, 'NOT_VALID_BODY');

  const updatedQuestion = await SERVICES.QUESTIONS.update(req.body as IQuestion);
  return res.status(Http_status_codes.OK).json(updatedQuestion);
});

questionsRouter.delete('/', async (req, res) => {
  const {success} = zod.object({
    id: zod.string().uuid(),
  }).safeParse(req.body);

  if (!success) throw new RouteError(Http_status_codes.BAD_REQUEST, 'NOT_VALID_BODY');

  await SERVICES.QUESTIONS.drop(req.body as IQuestion);

  return res.status(Http_status_codes.OK).json({ success: true });
});

export default questionsRouter;

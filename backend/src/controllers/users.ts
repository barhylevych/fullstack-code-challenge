import { Router } from 'express';
import * as SERVICES from '../services';
import Http_status_codes from '../constants/http_status_codes';

const userRouter = Router();

userRouter.get('/', async (_, res) => {
  const users = await SERVICES.USERS.getAll();
  return res.status(Http_status_codes.OK).json(users);
});

export default userRouter;

import { Router } from 'express';
import usersAPI from './users';
import questionsAPI from './questions';
import answersAPI from './answers';

const router = Router();

router.use('/users', usersAPI);
router.use('/questions', questionsAPI);
router.use('/answers', answersAPI);

export default router;

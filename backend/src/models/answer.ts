import zod from 'zod';

export interface IAnswer {
    id: number;
    message: string;
    userId: string;
    questionId: string;
    createdAt: Date;
    editedAt: Date;
}

export class Answer {
  static new(question: Partial<IAnswer>): IAnswer {
    return {
      id: (question.id ?? -1),
      message: (question.message ?? ''),
      userId: question.userId ?? '',
      questionId: question.questionId ?? '',
      createdAt: (question.createdAt ? new Date(question.createdAt) : new Date()),
      editedAt: (question.editedAt ? new Date(question.editedAt) : new Date()),
    };
  }

  static from(param: object): IAnswer {
    if (!Answer.validate(param)) throw new Error('INVALID_ANSWER');
    return Answer.new(param);
  }

  static validate(question: object): question is IAnswer {
    return zod.object({
      id: zod.string(),
      message: zod.string(),
      questionId: zod.string(),
      userId: zod.string(),
      createdAt: zod.date(),
      editedAt: zod.date(),
    }).safeParse(question).success;
  }
}

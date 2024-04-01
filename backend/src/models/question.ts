import zod from 'zod';

export interface IQuestion {
    id: number;
    title: string;
    description: string;
    userId: string;
    createdAt: Date;
    editedAt: Date;
}

export class Question {
  static new(question: Partial<IQuestion>): IQuestion {
    return {
      id: (question.id ?? -1),
      title: (question.title ?? ''),
      description: (question.description ?? ''),
      userId: question.userId ?? '',
      createdAt: (question.createdAt ? new Date(question.createdAt) : new Date()),
      editedAt: (question.editedAt ? new Date(question.editedAt) : new Date()),
    };
  }

  static from(param: object): IQuestion {
    if (!Question.validate(param)) throw new Error('INVALID_QUESTION');
    return Question.new(param);
  }

  static validate(question: object): question is IQuestion {
    return zod.object({
      id: zod.string(),
      title: zod.string(),
      description: zod.string(),
      userId: zod.string(),
      createdAt: zod.date(),
      editedAt: zod.date(),
    }).safeParse(question).success;
  }
}

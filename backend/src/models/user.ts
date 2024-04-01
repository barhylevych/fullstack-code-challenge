import zod from 'zod';

export interface IUser {
    id: number;
    name: string;
    createdAt: Date;
}

export class User {
  static new(user: Partial<IUser>): IUser {
    return {
      id: (user.id ?? -1),
      name: (user.name ?? ''),
      createdAt: (user.createdAt ? new Date(user.createdAt) : new Date()),
    };
  }

  static from(param: object): IUser {
    if (!User.validate(param)) throw new Error('INVALID_USER');
    return User.new(param);
  }

  static validate(user: object): user is IUser {
    return zod.object({
      id: zod.string(),
      name: zod.string(),
      createdAt: zod.date(),
    }).safeParse(user).success;
  }
}

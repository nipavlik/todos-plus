import { User } from '@prisma/client';

export type JwtUser = {
  userId: number;
};

export type UserNoPassword = Omit<User, 'password'>;

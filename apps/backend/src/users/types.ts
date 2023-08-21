import { Prisma, User as UserPrisma } from '@prisma/client';

export type User = UserPrisma;

export type UserNoPassword = Omit<User, 'password'>;

export type JwtUser = Pick<User, 'id'>;

export type FindOneUser = Prisma.UserWhereInput;

export type CreateUser = Pick<
  Prisma.UserCreateInput,
  'firstName' | 'lastName' | 'nickname' | 'password'
>;

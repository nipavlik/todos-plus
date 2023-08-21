import { Prisma, Todo as TodoPrisma } from '@prisma/client';

export type Todo = TodoPrisma;

export type CreateTodo = {
  title: string;
  content: string;
  userId: number;
};

export type GetAllTodos = {
  skip: number;
  take: number;
  cursor?: Prisma.TodoWhereUniqueInput;
  where?: Prisma.TodoWhereInput;
  orderBy?: Prisma.TodoOrderByWithRelationInput;
};

export type UpdateTodo = Prisma.TodoUpdateInput;

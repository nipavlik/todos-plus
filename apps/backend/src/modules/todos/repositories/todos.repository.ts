import { Injectable } from '@nestjs/common';
import { Prisma, Todo } from '@prisma/client';

import { PrismaService } from '../../../core/prisma/prisma.service';
import { ReturnPagination, getPaginationData } from 'src/utils/paginations';

@Injectable()
export class TodosRepository {
  constructor(private prisma: PrismaService) {}

  async create(options: { data: Prisma.TodoCreateInput }): Promise<Todo> {
    const { data } = options;
    return this.prisma.todo.create({ data });
  }

  async findAll(options: {
    skip: number;
    take: number;
    cursor?: Prisma.TodoWhereUniqueInput;
    where?: Prisma.TodoWhereInput;
    orderBy?: Prisma.TodoOrderByWithRelationInput;
  }): Promise<ReturnPagination<Todo>> {
    const { skip, take, cursor, where, orderBy } = options;

    const [todos, count] = await this.prisma.$transaction([
      this.prisma.todo.findMany({ skip, take, cursor, where, orderBy }),
      this.prisma.todo.count({ where }),
    ]);

    return getPaginationData<Todo>(todos, skip, take, count);
  }
}

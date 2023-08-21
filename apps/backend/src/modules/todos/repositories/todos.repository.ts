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

  async findOne(options: {
    where: Prisma.TodoWhereInput;
  }): Promise<Todo | null> {
    const { where } = options;
    return await this.prisma.todo.findFirst({ where });
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

  async update(params: {
    where: Prisma.TodoWhereUniqueInput;
    data: Prisma.TodoUpdateInput;
  }): Promise<Todo> {
    const { where, data } = params;
    return this.prisma.todo.update({ where, data });
  }

  async delete(params: { where: Prisma.TodoWhereUniqueInput }): Promise<Todo> {
    const { where } = params;
    return this.prisma.todo.delete({ where });
  }
}

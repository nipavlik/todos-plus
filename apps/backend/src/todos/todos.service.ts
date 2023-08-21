import { Injectable, NotFoundException } from '@nestjs/common';

import { TodosRepository } from './repositories/todos.repository';
import { CreateTodo, Todo, GetAllTodos } from './types';
import { ReturnPagination } from 'src/utils/paginations';

@Injectable()
export class TodosService {
  constructor(private todosRepository: TodosRepository) {}

  async create(data: CreateTodo): Promise<Todo> {
    return await this.todosRepository.create({
      data: {
        title: data.title,
        content: data.content,
        user: { connect: { id: data.userId } },
      },
    });
  }

  async getAll(options: GetAllTodos): Promise<ReturnPagination<Todo>> {
    const todos = await this.todosRepository.findAll(options);

    return todos;
  }

  async delete(todoId: number): Promise<Todo> {
    const exist = await this.todosRepository.findOne({ where: { id: todoId } });
    if (!exist) throw new NotFoundException('NOT_FOUND_TODO');

    return await this.todosRepository.delete({ where: { id: todoId } });
  }
}
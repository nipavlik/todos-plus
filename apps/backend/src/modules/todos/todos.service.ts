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

    if (todos.items.length === 0) {
      throw new NotFoundException('NOT_FOUND_PAGE');
    }

    return todos;
  }
}

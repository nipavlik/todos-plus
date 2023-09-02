import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { ReturnPagination, getPaginationData } from 'src/utils/paginations';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  async create(data: { title: string; content: string; userId: number }) {
    const todo = this.todosRepository.create(data);

    const newTodo = await this.todosRepository.save(todo);

    return newTodo;
  }

  async getAllByUserId(options: {
    userId: number;
    skip: number;
    take: number;
  }) {
    const [todos, count] = await this.todosRepository.findAndCount({
      where: { userId: options.userId },
      skip: options.skip,
      take: options.take,
      order: {
        createdAt: 'DESC',
      },
    });

    return getPaginationData<Todo>(todos, options.skip, options.take, count);
  }

  async delete(todoId: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({ where: { id: todoId } });
    if (!todo) throw new NotFoundException('NOT_FOUND_TODO');

    await this.todosRepository.remove(todo);

    return todo;
  }

  async update(
    todoId: number,
    data: { title: string; content: string; done: boolean },
  ): Promise<Todo> {
    const todo = await this.todosRepository.findOne({ where: { id: todoId } });
    if (!todo) throw new NotFoundException('NOT_FOUND_TODO');

    todo.title = data.title;
    todo.content = data.content;
    todo.done = data.done;

    return await this.todosRepository.save(todo);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Todo } from './entities/todo.entity';

import { ReturnPagination, getPaginationData } from '../utils/paginations';

/**
 * Сервис для работы с задачами
 * @Injectable()
 * @public
 * @class
 * @classdesc Представляет сервис задач.
 */
@Injectable()
export class TodosService {
  /**
   * Конструктор сервиса
   * @param todosRepository - Репозиторий задач
   */
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  /**
   * Создает новую задачу
   * @param data - Данные для создания задачи
   * @returns Созданная задача
   */
  async create(data: {
    title: string;
    content: string;
    userId: number;
  }): Promise<Todo> {
    const todo = this.todosRepository.create(data);

    const newTodo = await this.todosRepository.save(todo);

    return newTodo;
  }

  /**
   * Возвращает список задач для указанного пользователя с пагинацией
   * @param options - Опции запроса
   * @returns Список задач с пагинационными данными
   */
  async getAllByUserId(options: {
    userId: number;
    skip: number;
    take: number;
  }): Promise<ReturnPagination<Todo>> {
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

  /**
   * Удаляет задачу по ее идентификатору
   * @param todoId - Идентификатор задачи
   * @returns Удаленная задача
   */
  async delete(todoId: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({ where: { id: todoId } });
    if (!todo) throw new NotFoundException('NOT_FOUND_TODO');

    await this.todosRepository.remove(todo);

    return todo;
  }

  /**
   * Обновляет информацию о задаче
   * @param todoId - Идентификатор задачи
   * @param data - Новые данные задачи
   * @returns Обновленная задача
   */
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

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseGuards,
  Body,
  Query,
  Param,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { AuthUser } from '../auth/decorators/authUser.decorator';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

import { TodosService } from './todos.service';

import { ReturnPagination, getPaginationOptions } from '../utils/paginations';

import { CreateTodoBodyDto } from './dto/createTodoBody.dto';
import { GetAllTodosQueryDto } from './dto/getAllTodosQuery.dto';
import { DeleteParams } from './dto/deleteTodoParams.dto';
import { UpdateTodoParams } from './dto/updateTodoParams.dto';
import { UpdateTodoBodyDto } from './dto/updateTodoBody.dto';

import { Todo } from './entities/todo.entity';

import { JwtUser } from '../users/types';
import {
  getKeyCacheGetAllTodos,
  getKeyPatternGetAllTodos,
} from '../utils/cache';

@Controller('/todos')
export class TodosController {
  constructor(
    private todosService: TodosService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(
    @AuthUser() user: JwtUser,
    @Body() createTodoDto: CreateTodoBodyDto,
  ): Promise<Todo> {
    const newTodo = await this.todosService.create({
      title: createTodoDto.title,
      content: createTodoDto.content,
      userId: user.id,
    });

    const keys = await this.cacheManager.store.keys(
      getKeyPatternGetAllTodos(user.id),
    );
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));

    return newTodo;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAll(
    @AuthUser() user: JwtUser,
    @Query() query: GetAllTodosQueryDto,
  ): Promise<ReturnPagination<Todo>> {
    const paginationOptions = getPaginationOptions(query.page, query.limit);

    const cacheData = await this.cacheManager.get<ReturnPagination<Todo>>(
      getKeyCacheGetAllTodos(
        user.id,
        paginationOptions.offset,
        paginationOptions.limit,
      ),
    );

    if (cacheData) {
      return cacheData;
    }

    const data = await this.todosService.getAllByUserId({
      userId: user.id,
      skip: paginationOptions.offset,
      take: paginationOptions.limit,
    });

    await this.cacheManager.set(
      getKeyCacheGetAllTodos(
        user.id,
        paginationOptions.offset,
        paginationOptions.limit,
      ),
      data,
    );

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:todoId')
  async update(
    @AuthUser() user: JwtUser,
    @Param() params: UpdateTodoParams,
    @Body() updateTodoDto: UpdateTodoBodyDto,
  ): Promise<Todo> {
    const todo = await this.todosService.update(params.todoId, updateTodoDto);

    const keys = await this.cacheManager.store.keys(
      getKeyPatternGetAllTodos(todo.userId),
    );
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));

    return todo;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:todoId')
  async delete(
    @AuthUser() user: JwtUser,
    @Param() params: DeleteParams,
  ): Promise<Todo> {
    const todo = await this.todosService.delete(params.todoId);

    const keys = await this.cacheManager.store.keys(
      getKeyPatternGetAllTodos(todo.userId),
    );
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));

    return todo;
  }
}

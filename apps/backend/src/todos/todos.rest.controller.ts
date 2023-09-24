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
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { ThrottlerUserGuard } from '../rateLimit/guards/throttlerUser.guard';

import { AuthUser } from '../auth/decorators/authUser.decorator';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

import { TodosService } from './todos.service';
import { TodosCacheService } from './todosCache.service';

import { ReturnPagination, getPaginationOptions } from '../utils/paginations';

import { CreateTodoBodyDto } from './dto/createTodoBody.dto';
import { GetAllTodosQueryDto } from './dto/getAllTodosQuery.dto';
import { DeleteParams } from './dto/deleteTodoParams.dto';
import { UpdateTodoParams } from './dto/updateTodoParams.dto';
import { UpdateTodoBodyDto } from './dto/updateTodoBody.dto';

import { Todo } from './entities/todo.entity';

import { JwtUser } from '../users/types';

@Controller('/todos')
export class TodosController {
  constructor(
    private todosService: TodosService,
    private todosCacheService: TodosCacheService,
  ) {}

  @Throttle({ default: { limit: 20, ttl: 60 * 1000 } })
  @UseGuards(JwtAuthGuard, ThrottlerUserGuard)
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

    await this.todosCacheService.resetAllByUserId({ userId: newTodo.userId });

    return newTodo;
  }

  @Throttle({ default: { limit: 100, ttl: 60 * 1000 } })
  @UseGuards(JwtAuthGuard, ThrottlerUserGuard)
  @Get('/')
  async getAllByUserId(
    @AuthUser() user: JwtUser,
    @Query() query: GetAllTodosQueryDto,
  ): Promise<ReturnPagination<Todo>> {
    const cacheData = await this.todosCacheService.getAllByUserId({
      userId: user.id,
      page: query.page,
      limit: query.limit,
    });

    if (cacheData) {
      return cacheData;
    }

    const paginationOptions = getPaginationOptions(query.page, query.limit);

    const data = await this.todosService.getAllByUserId({
      userId: user.id,
      skip: paginationOptions.offset,
      take: paginationOptions.limit,
    });

    this.todosCacheService.setAllByUserId(
      {
        userId: user.id,
        page: query.page,
        limit: query.limit,
      },
      data,
    );

    return data;
  }

  @Throttle({ default: { limit: 200, ttl: 60 * 1000 } })
  @UseGuards(JwtAuthGuard, ThrottlerUserGuard)
  @Put('/:todoId')
  async update(
    @AuthUser() user: JwtUser,
    @Param() params: UpdateTodoParams,
    @Body() updateTodoDto: UpdateTodoBodyDto,
  ): Promise<Todo> {
    const todo = await this.todosService.update(params.todoId, updateTodoDto);

    await this.todosCacheService.resetAllByUserId({ userId: todo.userId });

    return todo;
  }

  @Throttle({ default: { limit: 200, ttl: 60 * 1000 } })
  @UseGuards(JwtAuthGuard, ThrottlerUserGuard)
  @Delete('/:todoId')
  async delete(
    @AuthUser() user: JwtUser,
    @Param() params: DeleteParams,
  ): Promise<Todo> {
    const todo = await this.todosService.delete(params.todoId);

    await this.todosCacheService.resetAllByUserId({ userId: todo.userId });

    return todo;
  }
}

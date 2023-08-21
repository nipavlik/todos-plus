import {
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  Body,
  Query,
  Param,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/createTodo.dto';
import { JwtUser } from '../users/types';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { Todo } from './types';
import { ReturnPagination, getPaginationOptions } from 'src/utils/paginations';
import { GetAllTodosDto } from './dto/getAllTodos.dto';
import { DeleteOneParams } from './dto/deleteOneParams.dto';

@Controller('/todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(
    @AuthUser() user: JwtUser,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<Todo> {
    return await this.todosService.create({
      title: createTodoDto.title,
      content: createTodoDto.content,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAll(
    @AuthUser() user: JwtUser,
    @Query() query: GetAllTodosDto,
  ): Promise<ReturnPagination<Todo>> {
    const paginationOptions = getPaginationOptions(query.page, query.limit);

    return await this.todosService.getAll({
      where: {
        userId: user.id,
      },
      skip: paginationOptions.offset,
      take: paginationOptions.limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:todoId')
  async delete(@AuthUser() user: JwtUser, @Param() params: DeleteOneParams) {
    return await this.todosService.delete(params.todoId);
  }
}

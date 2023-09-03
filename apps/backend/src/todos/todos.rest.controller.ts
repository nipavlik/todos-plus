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

@Controller('/todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(
    @AuthUser() user: JwtUser,
    @Body() createTodoDto: CreateTodoBodyDto,
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
    @Query() query: GetAllTodosQueryDto,
  ): Promise<ReturnPagination<Todo>> {
    const paginationOptions = getPaginationOptions(query.page, query.limit);

    return await this.todosService.getAllByUserId({
      userId: user.id,
      skip: paginationOptions.offset,
      take: paginationOptions.limit,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:todoId')
  async update(
    @AuthUser() user: JwtUser,
    @Param() params: UpdateTodoParams,
    @Body() updateTodoDto: UpdateTodoBodyDto,
  ): Promise<Todo> {
    return await this.todosService.update(params.todoId, updateTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:todoId')
  async delete(
    @AuthUser() user: JwtUser,
    @Param() params: DeleteParams,
  ): Promise<Todo> {
    return await this.todosService.delete(params.todoId);
  }
}

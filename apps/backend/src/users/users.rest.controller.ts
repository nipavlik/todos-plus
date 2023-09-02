import { Controller, Get, Put, Body, UseGuards, Param } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { AuthUser } from '../auth/decorators/authUser.decorator';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

import { UsersService } from './users.service';

import { GetUserParams } from './dto/getUserParams.dto';
import { UpdateUserParams } from './dto/updateUserParams.dto';
import { UpdateUserBodyDto } from './dto/updateUserBody.dto';
import { UserResponseDto } from './dto/userResponse.dto';

@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  async getOne(
    @AuthUser() currentUser: any,
    @Param() params: GetUserParams,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.getOneByIdOrFail(params.userId);

    return plainToClass(UserResponseDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:userId')
  async update(
    @AuthUser() user: any,
    @Param() params: UpdateUserParams,
    @Body() updateUserDto: UpdateUserBodyDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.update(
      params.userId,
      updateUserDto,
    );

    return plainToClass(UserResponseDto, updatedUser);
  }
}

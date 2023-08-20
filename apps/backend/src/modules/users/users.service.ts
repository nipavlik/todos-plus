import { Injectable, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';

import { UsersRepository } from './repositories/users.repository';
import { User } from '@prisma/client';
import { CreateUser, FindOneUser } from './types';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getOne(data: FindOneUser): Promise<User | null> {
    const user = await this.usersRepository.getOne({
      where: data,
    });

    return user;
  }

  async create(data: CreateUser): Promise<User> {
    const existUser = await this.getOne({ nickname: data.nickname });
    if (existUser) throw new BadRequestException('NICKNAME_USED');

    const hashPassword = await argon2.hash(data.password);

    const newUser = await this.usersRepository.create({
      data: { ...data, password: hashPassword },
    });

    return newUser;
  }
}

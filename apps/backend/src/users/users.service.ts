import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import * as lodash from 'lodash';

import { UsersRepository } from './repositories/users.repository';
import { User } from '@prisma/client';
import { CreateUser, FindOneUser, UpdateUser, UserNoPassword } from './types';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getOne(data: FindOneUser): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: data,
    });

    return user;
  }

  async create(data: CreateUser): Promise<User> {
    const existUser = await this.getOne({ username: data.username });
    if (existUser) throw new BadRequestException('USERNAME_USED');

    const hashPassword = await argon2.hash(data.password);

    const newUser = await this.usersRepository.create({
      data: { ...data, password: hashPassword },
    });

    return newUser;
  }

  async update(userId: number, data: UpdateUser): Promise<UserNoPassword> {
    const exist = await this.usersRepository.findOne({ where: { id: userId } });
    if (!exist) throw new NotFoundException('NOT_FOUND_TODO');

    const newData = data;

    if (newData.password) {
      newData.password = await argon2.hash(String(data.password));
    }

    const user = await this.usersRepository.update({
      where: { id: userId },
      data: newData,
    });

    const userNoPassword: UserNoPassword = lodash.omit(user, ['password']);

    return userNoPassword;
  }
}

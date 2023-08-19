import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';

import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findOne(data: { nickname: string }): Promise<User | null> {
    const user = await this.usersRepository.getOne({
      where: { nickname: data.nickname },
    });

    return user;
  }

  async create(data: {
    firstName: string;
    lastName: string;
    nickname: string;
    password: string;
  }): Promise<User> {
    const existUser = await this.findOne({ nickname: data.nickname });
    if (existUser) throw new BadRequestException('NICKNAME_USED');

    const hashPassword = await argon2.hash(data.password);

    const newUser = await this.usersRepository.create({
      data: { ...data, password: hashPassword },
    });

    return newUser;
  }
}

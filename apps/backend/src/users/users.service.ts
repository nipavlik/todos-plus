import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
// import * as lodash from 'lodash';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getOneById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async getOneByIdOrFail(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('NOT_FOUND_USER');

    return user;
  }

  async getOneByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { username } });
  }

  async create(data: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
  }): Promise<User> {
    const existUser = await this.getOneByUsername(data.username);
    if (existUser) throw new BadRequestException('USERNAME_USED');

    const hashPassword = await argon2.hash(data.password);

    const newUser = this.usersRepository.create({
      ...data,
      password: hashPassword,
    });

    await this.usersRepository.save(newUser);

    return newUser;
  }

  async update(
    userId: number,
    data: {
      firstName: string;
      lastName: string;
      password?: string;
    },
  ) {
    const user = await this.getOneByIdOrFail(userId);

    user.firstName = data.firstName;
    user.lastName = data.lastName;

    if (data.password) {
      user.password = await argon2.hash(String(data.password));
    }

    // const userNoPassword: UserNoPassword = lodash.omit(user, ['password']);

    return await this.usersRepository.save(user);
  }
}

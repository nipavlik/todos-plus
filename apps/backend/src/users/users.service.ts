import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

/**
 * Сервис пользователей.
 * @Injectable()
 * @public
 * @class
 * @classdesc Представляет сервис пользователей.
 */
@Injectable()
export class UsersService {
  /**
   * Конструктор класса UsersService.
   * @constructor
   * @param {Repository<User>} usersRepository - Репозиторий пользователей.
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Получить пользователя по идентификатору.
   * @public
   * @async
   * @param {number} id - Идентификатор пользователя.
   * @returns {Promise<User | null>} - Объект пользователя или null, если пользователь не найден.
   */
  async getOneById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  /**
   * Получить пользователя по идентификатору или вызвать ошибку, если пользователь не найден.
   * @public
   * @async
   * @param {number} id - Идентификатор пользователя.
   * @returns {Promise<User>} - Объект пользователя.
   * @throws {NotFoundException} - Исключение, если пользователь не найден.
   */
  async getOneByIdOrFail(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('NOT_FOUND_USER');

    return user;
  }

  /**
   * Получить пользователя по имени пользователя.
   * @public
   * @async
   * @param {string} username - Имя пользователя.
   * @returns {Promise<User | null>} - Объект пользователя или null, если пользователь не найден.
   */
  async getOneByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { username } });
  }

  /**
   * Создать пользователя.
   * @public
   * @async
   * @param {Object} data - Данные для создания пользователя.
   * @param {string} data.firstName - Имя пользователя.
   * @param {string} data.lastName - Фамилия пользователя.
   * @param {string} data.username - Имя пользователя.
   * @param {string} data.password - Пароль пользователя.
   * @throws {BadRequestException} - Исключение, если имя пользователя уже используется.
   * @returns {Promise<User>} - Объект созданного пользователя.
   */
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

  /**
   * Обновить пользователя.
   * @public
   * @async
   * @param {number} userId - Идентификатор пользователя.
   * @param {Object} data - Данные для обновления пользователя.
   * @param {string} data.firstName - Имя пользователя.
   * @param {string} data.lastName - Фамилия пользователя.
   * @param {string} data.password - Пароль пользователя (опционально).
   * @returns {Promise<User>} - Обновленный объект пользователя.
   */
  async update(
    userId: number,
    data: {
      firstName: string;
      lastName: string;
      password?: string;
    },
  ): Promise<User> {
    const user = await this.getOneByIdOrFail(userId);

    user.firstName = data.firstName;
    user.lastName = data.lastName;

    if (data.password) {
      user.password = await argon2.hash(String(data.password));
    }

    return await this.usersRepository.save(user);
  }
}

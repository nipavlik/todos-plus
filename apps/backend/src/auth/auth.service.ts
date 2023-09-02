import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as argon2 from 'argon2';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from '../users/users.service';

import { PairKey } from './types';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refreshToken.entity';

/**
 * Сервис аутентификации.
 * @Injectable()
 * @public
 * @class
 * @classdesc Представляет сервис аутентификации.
 */
@Injectable()
export class AuthService {
  /**
   * @constructor
   * @param {UsersService} usersService - Сервис пользователей.
   * @param {JwtService} jwtService - Сервис JWT.
   * @param {ConfigService} configService - Конфигурационный сервис.
   * @param {Repository<RefreshToken>} refreshTokensRepository - Репозиторий токенов обновления.
   */
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
  ) {}

  /**
   * Проверяет учетные данные пользователя.
   * @param {string} username - Имя пользователя.
   * @param {string} password - Пароль.
   * @returns {Promise<User|null>} - Промис, который разрешается пользователем, если проверка успешна, в противном случае null.
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.getOneByUsername(username);
    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }
    return null;
  }

  /**
   * Выполняет вход пользователя и генерирует пару токенов доступа и обновления.
   * @param {User} user - Пользователь.
   * @returns {Promise<PairKey>} - Промис, который разрешается парой токенов доступа и обновления.
   */
  async login(user: User): Promise<PairKey> {
    return await this.generatePairKey(user.id);
  }

  /**
   * Регистрирует нового пользователя.
   * @param {Object} data - Данные пользователя (firstName, lastName, username, password).
   * @returns {Promise<User>} - Промис, который разрешается созданным пользователем.
   */
  async register(data: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
  }): Promise<User> {
    return await this.usersService.create(data);
  }

  /**
   * Генерирует пару токенов доступа и обновления для указанного пользователя.
   * @param {number} userId - Идентификатор пользователя.
   * @returns {Promise<PairKey>} - Промис, который разрешается парой токенов доступа и обновления.
   */
  async generatePairKey(userId: number): Promise<PairKey> {
    const payload = { sub: userId };

    const refreshToken = this.refreshTokensRepository.create({
      user: { id: userId },
      token: uuidv4(),
    });
    await this.refreshTokensRepository.save(refreshToken);

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: refreshToken.token,
    };
  }

  /**
   * Обновляет токены доступа и обновления для указанного токена обновления.
   * @param {string} token - Токен обновления.
   * @returns {Promise<PairKey>} - Промис, который разрешается новой парой токенов доступа и обновления.
   * @throws {NotFoundException} - Если токен обновления не найден или недействителен.
   */
  async refreshToken(token: string): Promise<PairKey> {
    const refreshToken = await this.refreshTokensRepository.findOne({
      where: { token },
    });
    if (!refreshToken) throw new NotFoundException('NOT_FOUND_TOKEN');

    const now = DateTime.now();
    const tokenDateIn3Days = DateTime.fromISO(
      refreshToken.updatedAt.toISOString(),
    ).plus({
      seconds: this.configService.get<number>('auth.refreshExpiresIn'),
    });

    if (now > tokenDateIn3Days) {
      throw new NotFoundException('INVALID_TOKEN');
    }

    const payload = { sub: refreshToken.userId };

    refreshToken.token = uuidv4();

    await this.refreshTokensRepository.save(refreshToken);

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: refreshToken.token,
    };
  }

  /**
   * Получает информацию о пользователе на основе его идентификатора.
   * @param {number} userId - Идентификатор пользователя.
   * @returns {Promise<User>} - Промис, который разрешается информацией о пользова
   */
  async me(userId: number): Promise<User> {
    return await this.usersService.getOneByIdOrFail(userId);
  }
}

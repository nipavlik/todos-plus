import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { v4 as uuidv4 } from 'uuid';
import * as argon2 from 'argon2';
import { DateTime } from 'luxon';

import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

import { RefreshTokensRepository } from './repositories/refreshTokens.repository';

import { PairKey } from './types';
import { User, UserNoPassword } from '../users/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokensRepository: RefreshTokensRepository,
    private configService: ConfigService,
  ) {}

  /**
   * Проверяет пользователя по никнейму и паролю.
   * @param {string} nickname - Никнейм пользователя.
   * @param {string} password - Пароль пользователя.
   * @returns {Promise<User | null>} - Объект пользователя или null, если пользователь не найден или пароль неверный.
   */
  async validateUser(nickname: string, password: string): Promise<User | null> {
    const user = await this.usersService.getOne({ nickname });
    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }
    return null;
  }

  /**
   * Пользовательная сессия входа.
   * @param {User} user - Объект пользователя.
   * @returns {Promise<PairKey>} - Объект с ключами доступа и обновления.
   */
  async login(user: User): Promise<PairKey> {
    return await this.generatePairKey(user.id);
  }

  /**
   * Регистрирует нового пользователя.
   * @param {Object} data - Данные нового пользователя.
   * @param {string} data.firstName - Имя пользователя.
   * @param {string} data.lastName - Фамилия пользователя.
   * @param {string} data.nickname - Никнейм пользователя.
   * @param {string} data.password - Пароль пользователя.
   * @returns {Promise<User>} - Объект пользователя.
   */
  async register(data: {
    firstName: string;
    lastName: string;
    nickname: string;
    password: string;
  }): Promise<User> {
    return await this.usersService.create(data);
  }

  /**
   * Генерирует пару ключей.
   * @param {number} userId - Идентификатор пользователя.
   * @returns {Promise<PairKey>} - Объект с токенами доступа и обновления.
   */
  async generatePairKey(userId: number): Promise<PairKey> {
    const payload = { sub: userId };

    const refreshToken = await this.refreshTokensRepository.create({
      data: { user: { connect: { id: userId } }, token: uuidv4() },
    });

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: refreshToken.token,
    };
  }

  /**
   * Обновляет токен доступа и токен обновления.
   * @param {string} token - Токен обновления.
   * @returns {Promise<PairKey>} - Объект, содержащий обновленные значения токенов.
   * @throws {NotFoundException} - Если токен не найден или является недействительным.
   */
  async refreshToken(token: string): Promise<PairKey> {
    const oldRefreshToken = await this.refreshTokensRepository.getOne({
      where: { token },
    });
    if (!oldRefreshToken) throw new NotFoundException('NOT_FOUND_TOKEN');

    const now = DateTime.now();
    const tokenDateIn3Days = DateTime.fromISO(
      oldRefreshToken.updatedAt.toISOString(),
    ).plus({
      seconds: this.configService.get<number>('auth.refreshExpiresIn'),
    });

    if (now > tokenDateIn3Days) {
      throw new NotFoundException('INVALID_TOKEN');
    }

    const payload = { sub: oldRefreshToken.userId };

    const newRefreshToken = await this.refreshTokensRepository.update({
      where: { id: oldRefreshToken.id },
      data: { token: uuidv4() },
    });

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: newRefreshToken.token,
    };
  }

  async me(userId: number): Promise<UserNoPassword> {
    const user: User | null = await this.usersService.getOne({ id: userId });
    if (!user) throw new NotFoundException('NOT_FOUND_USER');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}

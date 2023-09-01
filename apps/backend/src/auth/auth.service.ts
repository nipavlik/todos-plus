import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
// import * as lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import * as argon2 from 'argon2';
import { DateTime } from 'luxon';

import { UsersService } from '../users/users.service';

import { PairKey } from './types';
import { User } from 'src/users/entities/user.entity';
import { RefreshToken } from './entities/refreshToken.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
  ) {}

  /**
   * Проверяет пользователя по никнейму и паролю.
   * @param {string} username - Никнейм пользователя.
   * @param {string} password - Пароль пользователя.
   * @returns {Promise<User | null>} - Объект пользователя или null, если пользователь не найден или пароль неверный.
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.getOneByUsername(username);
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
   * @param {string} data.username - Никнейм пользователя.
   * @param {string} data.password - Пароль пользователя.
   * @returns {Promise<User>} - Объект пользователя.
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
   * Генерирует пару ключей.
   * @param {number} userId - Идентификатор пользователя.
   * @returns {Promise<PairKey>} - Объект с токенами доступа и обновления.
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
   * Обновляет токен доступа и токен обновления.
   * @param {string} token - Токен обновления.
   * @returns {Promise<PairKey>} - Объект, содержащий обновленные значения токенов.
   * @throws {NotFoundException} - Если токен не найден или является недействительным.
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

  async me(userId: number) {
    const user = await this.usersService.getOneByIdOrFail(userId);

    // const userNoPassword: UserNoPassword = lodash.omit(user, ['password']);

    return user;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { User } from './entities/user.entity';

@Injectable()
export class UsersCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getOneById({ userId }: { userId: number }): Promise<User | null> {
    const cacheData = await this.cacheManager.get<User>(
      this.getOneByIdKey({ userId }),
    );

    if (!cacheData) return null;

    return cacheData;
  }

  async setOneById(key: { userId: number }, data: User) {
    await this.cacheManager.set(this.getOneByIdKey(key), data);
  }

  async resetOneById({ userId }: { userId: number }) {
    const keys = await this.cacheManager.store.keys(
      this.getOneByIdPattern({ userId }),
    );
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }

  getOneByIdKey({ userId }: { userId: number }): string {
    return `get-by-id-user:userId-${userId}`;
  }

  getOneByIdPattern({ userId }: { userId: number }): string {
    return `get-by-id-user:userId-${userId}`;
  }
}

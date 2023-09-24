import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { ReturnPagination } from '../utils/paginations';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getAllByUserId({
    userId,
    page,
    limit,
  }: {
    userId: number;
    page: number;
    limit: number;
  }): Promise<ReturnPagination<Todo> | null> {
    const cacheData = await this.cacheManager.get<ReturnPagination<Todo>>(
      this.getAllByUserIdKey({ userId, page, limit }),
    );

    if (!cacheData) return null;

    return cacheData;
  }

  async setAllByUserId(
    key: { userId: number; page: number; limit: number },
    data: ReturnPagination<Todo>,
  ) {
    await this.cacheManager.set(this.getAllByUserIdKey(key), data);
  }

  async resetAllByUserId({ userId }: { userId: number }) {
    const keys = await this.cacheManager.store.keys(
      this.getAllByUserIdPattern({ userId }),
    );
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }

  getAllByUserIdKey({
    userId,
    page,
    limit,
  }: {
    userId: number;
    page: number;
    limit: number;
  }): string {
    return `get-all-todos:userId-${userId}:page-${page}:limit-${limit}`;
  }

  getAllByUserIdPattern({ userId }: { userId: number }): string {
    return `get-all-todos:userId-${userId}:*`;
  }
}

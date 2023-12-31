import { ConfigModuleOptions } from '@nestjs/config';

import { validate } from './env.validation';

import appConfig from './app.config';
import authConfig from './auth.config';
import dbConfig from './db.config';
import cacheConfig from './cache.config';
import rateLimitConfig from './rateLimit.config';

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  cache: true,
  load: [appConfig, authConfig, dbConfig, cacheConfig, rateLimitConfig],
  validate,
};

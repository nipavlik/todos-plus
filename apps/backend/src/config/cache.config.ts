import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  url: process.env.CACHE_REDIS_URL,
  ttl: Number(process.env.CACHE_REDIS_DEFAULT_TTL),
}));

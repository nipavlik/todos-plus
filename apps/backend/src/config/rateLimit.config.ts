import { registerAs } from '@nestjs/config';

export default registerAs('rate-limit', () => ({
  url: process.env.RATE_LIMIT_REDIS_URL,
  ttl: Number(process.env.RATE_LIMIT_DEFAULT_TTL),
  limit: Number(process.env.RATE_LIMIT_DEFAULT_LIMIT),
}));

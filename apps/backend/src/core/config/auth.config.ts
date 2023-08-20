import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.AUTH_JWT_SECRET,
  jwtExpiresIn: Number(process.env.AUTH_JWT_EXPIRES_IN),
  refreshExpiresIn: Number(process.env.AUTH_REFRESH_EXPIRES_IN),
}));

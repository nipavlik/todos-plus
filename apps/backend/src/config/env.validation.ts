import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  APP_HOST: string;

  @IsNumber()
  APP_PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  AUTH_JWT_SECRET: string;

  @IsNumber()
  AUTH_JWT_EXPIRES_IN: number;

  @IsNumber()
  AUTH_REFRESH_EXPIRES_IN: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    for (const error of errors) {
      console.log(error.toString());
    }
    process.exit(1);
  }

  return validatedConfig;
}

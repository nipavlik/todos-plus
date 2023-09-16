import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import { configModuleOptions } from './config/options';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TodosModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 900, // 15m
      store: redisStore,
      url: 'redis://127.0.0.1:7020',
    }),
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        ({
          type: 'postgres',
          url: configService.get<string>('db.url'),
          autoLoadEntities: true,
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          migrationsTableName: 'migration',
          synchronize: false,
          logging: true,
        }) as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}

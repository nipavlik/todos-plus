import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { configModuleOptions } from './config/options';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { TodosModule } from './todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    // TodosModule,
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: '127.0.0.1',
      // port: 7010,
      // database: 'todos_plus2',
      // schema: 'public',
      // username: 'todosplus',
      // password: 'todosplus',
      url: 'postgresql://todosplus:todosplus@127.0.0.1:7010/todos_plus2?schema=public',
      autoLoadEntities: true,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      migrationsTableName: 'migration',
      synchronize: false,
    }),
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { UsersRepository } from './application/users.repository';
import { UsersService } from './application/users.service';
import { PostgresUsersRepository } from './infrastructure/postgres-users.repository';
import { UsersController } from './interfaces/http/users.controller';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, { provide: UsersRepository, useClass: PostgresUsersRepository }],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

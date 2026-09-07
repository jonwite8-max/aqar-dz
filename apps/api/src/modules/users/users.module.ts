import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { UsersRepository } from './application/users.repository';
import { UsersService } from './application/users.service';
import { PostgresUsersRepository } from './infrastructure/postgres-users.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, { provide: UsersRepository, useClass: PostgresUsersRepository }],
  exports: [UsersService],
})
export class UsersModule {}

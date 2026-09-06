import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { AuthorizationRepository } from './application/authorization.repository';
import { AuthorizationService } from './application/authorization.service';
import { PostgresAuthorizationRepository } from './infrastructure/postgres-authorization.repository';

@Module({
  imports: [DatabaseModule],
  providers: [AuthorizationService, { provide: AuthorizationRepository, useClass: PostgresAuthorizationRepository }],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}

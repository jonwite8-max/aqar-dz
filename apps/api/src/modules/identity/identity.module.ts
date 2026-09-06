import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { UsersModule } from '../users/users.module';
import { AuthService } from './application/auth.service';
import { IdentityRepository } from './application/identity.repository';
import { OtpDeliveryService } from './infrastructure/otp-delivery.service';
import { PostgresIdentityRepository } from './infrastructure/postgres-identity.repository';
import { AuthController } from './interfaces/http/auth.controller';
import { SessionGuard } from './interfaces/http/session.guard';

@Module({
  imports: [DatabaseModule, UsersModule, AuthorizationModule],
  providers: [AuthService, OtpDeliveryService, SessionGuard, { provide: IdentityRepository, useClass: PostgresIdentityRepository }],
  controllers: [AuthController],
  exports: [AuthService, SessionGuard],
})
export class IdentityModule {}

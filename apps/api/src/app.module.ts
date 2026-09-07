import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { domainModules } from './modules';
import { SystemModule } from './system/system.module';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]), SystemModule, ...domainModules],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

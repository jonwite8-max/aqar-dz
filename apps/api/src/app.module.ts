import { Module } from '@nestjs/common';
import { domainModules } from './modules';
import { SystemModule } from './system/system.module';

@Module({ imports: [SystemModule, ...domainModules] })
export class AppModule {}

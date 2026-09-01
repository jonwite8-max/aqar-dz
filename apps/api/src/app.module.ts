import { Module } from '@nestjs/common';
import { domainModules } from './modules';

@Module({ imports: [...domainModules] })
export class AppModule {}

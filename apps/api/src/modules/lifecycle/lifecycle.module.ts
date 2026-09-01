import { Module } from '@nestjs/common';

/**
 * Owns lifecycle policy and orchestration boundaries.
 * It must never delete object-storage files or user rows directly.
 * Concrete execution is delegated to Media, Identity/Users and Audit adapters.
 */
@Module({})
export class LifecycleModule {}

import { Injectable } from '@nestjs/common';
import type { QueryExecutor } from '../../../infrastructure/database/query-executor';
import { roleAllows, type Permission, type UserRole } from '../domain/authorization';
import { AuthorizationRepository } from './authorization.repository';

@Injectable()
export class AuthorizationService {
  constructor(private readonly roles: AuthorizationRepository) {}
  grantDefaultRole(userId: string, tx: QueryExecutor): Promise<void> { return this.roles.grantRole(userId, 'user', tx); }
  listRoles(userId: string): Promise<UserRole[]> { return this.roles.listRoles(userId); }
  hasPermission(roles: readonly UserRole[], permission: Permission): boolean { return roles.some((role) => roleAllows(role, permission)); }
}

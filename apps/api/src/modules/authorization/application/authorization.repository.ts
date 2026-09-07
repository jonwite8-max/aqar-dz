import type { QueryExecutor } from '../../../infrastructure/database/query-executor';
import type { UserRole } from '../domain/authorization';

export abstract class AuthorizationRepository {
  abstract grantRole(userId: string, role: UserRole, tx?: QueryExecutor): Promise<void>;
  abstract listRoles(userId: string, tx?: QueryExecutor): Promise<UserRole[]>;
}

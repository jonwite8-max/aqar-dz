import { Injectable } from '@nestjs/common';
import type { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import type { QueryExecutor } from '../../../infrastructure/database/query-executor';
import { AuthorizationRepository } from '../application/authorization.repository';
import type { UserRole } from '../domain/authorization';

type RoleRow = QueryResultRow & { role: UserRole };

@Injectable()
export class PostgresAuthorizationRepository extends AuthorizationRepository {
  constructor(private readonly db: DatabaseService) { super(); }
  private q(tx?: QueryExecutor): QueryExecutor { return tx ?? this.db; }
  async grantRole(userId: string, role: UserRole, tx?: QueryExecutor): Promise<void> {
    await this.q(tx).query(`INSERT INTO access_control.user_roles(user_id,role,scope_type,scope_key) VALUES($1,$2,'platform','*') ON CONFLICT DO NOTHING`, [userId, role]);
  }
  async listRoles(userId: string, tx?: QueryExecutor): Promise<UserRole[]> {
    const result = await this.q(tx).query<RoleRow>('SELECT role FROM access_control.user_roles WHERE user_id=$1 ORDER BY role', [userId]);
    return result.rows.map((row) => row.role);
  }
}

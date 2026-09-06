import { Injectable } from '@nestjs/common';
import type { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import type { QueryExecutor } from '../../../infrastructure/database/query-executor';
import { UsersRepository } from '../application/users.repository';
import type { User, UserStatus } from '../domain/user';

type UserRow = QueryResultRow & {
  id: string;
  status: UserStatus;
  display_name: string | null;
  locale: string;
  last_login_at: Date | null;
  last_active_at: Date;
  media_pruned_at: Date | null;
  legal_hold: boolean;
  created_at: Date;
  deleted_at: Date | null;
};

const projection = `id,status,display_name,locale,last_login_at,last_active_at,media_pruned_at,legal_hold,created_at,deleted_at`;

function map(row: UserRow): User {
  return {
    id: row.id,
    status: row.status,
    displayName: row.display_name,
    locale: row.locale,
    lastLoginAt: row.last_login_at,
    lastActiveAt: row.last_active_at,
    mediaPrunedAt: row.media_pruned_at,
    legalHold: row.legal_hold,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
  };
}

@Injectable()
export class PostgresUsersRepository extends UsersRepository {
  constructor(private readonly db: DatabaseService) { super(); }
  private q(tx?: QueryExecutor): QueryExecutor { return tx ?? this.db; }

  async create(tx?: QueryExecutor): Promise<User> {
    const result = await this.q(tx).query<UserRow>(`INSERT INTO accounts.users DEFAULT VALUES RETURNING ${projection}`);
    const row = result.rows[0];
    if (!row) throw new Error('User insert returned no row');
    return map(row);
  }

  async findById(id: string, tx?: QueryExecutor): Promise<User | null> {
    const result = await this.q(tx).query<UserRow>(`SELECT ${projection} FROM accounts.users WHERE id=$1 AND deleted_at IS NULL`, [id]);
    return result.rows[0] ? map(result.rows[0]) : null;
  }

  async markLogin(id: string, now: Date, tx?: QueryExecutor): Promise<void> {
    await this.q(tx).query('UPDATE accounts.users SET last_login_at=$2,last_active_at=$2,updated_at=$2,media_pruned_at=NULL WHERE id=$1', [id, now]);
  }

  async touchActivity(id: string, now: Date, tx?: QueryExecutor): Promise<void> {
    await this.q(tx).query("UPDATE accounts.users SET last_active_at=$2,updated_at=$2 WHERE id=$1 AND last_active_at < $2 - interval '1 hour'", [id, now]);
  }

  async removeRegistrationStub(id: string, tx?: QueryExecutor): Promise<void> {
    await this.q(tx).query('DELETE FROM accounts.users WHERE id=$1 AND last_login_at IS NULL', [id]);
  }
}

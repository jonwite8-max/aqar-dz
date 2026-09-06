import { Injectable } from '@nestjs/common';
import type { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import type { QueryExecutor } from '../../../infrastructure/database/query-executor';
import { OTP_MAX_ATTEMPTS } from '../domain/auth-policy';
import { IdentityRepository, type SessionRecord } from '../application/identity.repository';

type DateRow = QueryResultRow & { created_at: Date };
type IdRow = QueryResultRow & { id: string };
type UserIdRow = QueryResultRow & { user_id: string };
type BoolRow = QueryResultRow & { valid: boolean };
type SessionRow = QueryResultRow & { id: string; user_id: string; access_expires_at: Date; refresh_expires_at: Date };

function mapSession(row: SessionRow): SessionRecord { return { id: row.id, userId: row.user_id, accessExpiresAt: row.access_expires_at, refreshExpiresAt: row.refresh_expires_at }; }

@Injectable()
export class PostgresIdentityRepository extends IdentityRepository {
  constructor(private readonly db: DatabaseService) { super(); }
  private q(tx?: QueryExecutor): QueryExecutor { return tx ?? this.db; }

  async latestOtpCreatedAt(email: string, tx?: QueryExecutor): Promise<Date | null> {
    const result = await this.q(tx).query<DateRow>("SELECT created_at FROM identity.otp_challenges WHERE identity_kind='email' AND normalized_value=$1 ORDER BY created_at DESC LIMIT 1", [email]);
    return result.rows[0]?.created_at ?? null;
  }
  async createOtp(email: string, codeHash: string, expiresAt: Date, tx?: QueryExecutor): Promise<string> {
    const result = await this.q(tx).query<IdRow>("INSERT INTO identity.otp_challenges(identity_kind,normalized_value,code_hash,expires_at) VALUES('email',$1,$2,$3) RETURNING id", [email, codeHash, expiresAt]);
    const row = result.rows[0]; if (!row) throw new Error('OTP insert returned no row'); return row.id;
  }
  async invalidateOtp(id: string, tx?: QueryExecutor): Promise<void> { await this.q(tx).query('UPDATE identity.otp_challenges SET consumed_at=now() WHERE id=$1', [id]); }
  async consumeOtp(email: string, codeHash: string, tx?: QueryExecutor): Promise<boolean> {
    const result = await this.q(tx).query<BoolRow>(`WITH candidate AS (
      SELECT id,code_hash,expires_at,attempts FROM identity.otp_challenges
      WHERE identity_kind='email' AND normalized_value=$1 AND consumed_at IS NULL
      ORDER BY created_at DESC LIMIT 1 FOR UPDATE
    )
    UPDATE identity.otp_challenges c SET
      attempts=LEAST(candidate.attempts+1,$3),
      consumed_at=CASE
        WHEN candidate.code_hash=$2 AND candidate.expires_at>now() AND candidate.attempts<$3 THEN now()
        WHEN candidate.attempts+1 >= $3 THEN now()
        ELSE c.consumed_at
      END
    FROM candidate WHERE c.id=candidate.id
    RETURNING (candidate.code_hash=$2 AND candidate.expires_at>now() AND candidate.attempts<$3) AS valid`, [email, codeHash, OTP_MAX_ATTEMPTS]);
    return result.rows[0]?.valid === true;
  }
  async findUserIdByEmail(email: string, tx?: QueryExecutor): Promise<string | null> {
    const result = await this.q(tx).query<UserIdRow>("SELECT user_id FROM identity.identities WHERE identity_kind='email' AND normalized_value=$1 AND verified_at IS NOT NULL", [email]);
    return result.rows[0]?.user_id ?? null;
  }
  async claimVerifiedEmail(userId: string, email: string, now: Date, tx: QueryExecutor): Promise<string> {
    await tx.query("INSERT INTO identity.identities(user_id,identity_kind,normalized_value,verified_at) VALUES($1,'email',$2,$3) ON CONFLICT(identity_kind,normalized_value) DO NOTHING", [userId, email, now]);
    const result = await tx.query<UserIdRow>("SELECT user_id FROM identity.identities WHERE identity_kind='email' AND normalized_value=$1", [email]);
    const row = result.rows[0]; if (!row) throw new Error('Identity claim failed'); return row.user_id;
  }
  async createSession(input: { userId: string; accessHash: string; refreshHash: string; accessExpiresAt: Date; refreshExpiresAt: Date; userAgentHash: string | null; ipHash: string | null; rotatedFromId: string | null }, tx?: QueryExecutor): Promise<SessionRecord> {
    const result = await this.q(tx).query<SessionRow>(`INSERT INTO identity.sessions(user_id,access_token_hash,refresh_token_hash,access_expires_at,refresh_expires_at,user_agent_hash,ip_hash,rotated_from_id)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id,user_id,access_expires_at,refresh_expires_at`, [input.userId,input.accessHash,input.refreshHash,input.accessExpiresAt,input.refreshExpiresAt,input.userAgentHash,input.ipHash,input.rotatedFromId]);
    const row = result.rows[0]; if (!row) throw new Error('Session insert returned no row'); return mapSession(row);
  }
  async findByAccessHash(hash: string, tx?: QueryExecutor): Promise<SessionRecord | null> {
    const result = await this.q(tx).query<SessionRow>('SELECT id,user_id,access_expires_at,refresh_expires_at FROM identity.sessions WHERE access_token_hash=$1 AND revoked_at IS NULL AND access_expires_at>now()', [hash]);
    return result.rows[0] ? mapSession(result.rows[0]) : null;
  }
  async findByRefreshHash(hash: string, tx?: QueryExecutor): Promise<SessionRecord | null> {
    const result = await this.q(tx).query<SessionRow>('SELECT id,user_id,access_expires_at,refresh_expires_at FROM identity.sessions WHERE refresh_token_hash=$1 AND revoked_at IS NULL AND refresh_expires_at>now() FOR UPDATE', [hash]);
    return result.rows[0] ? mapSession(result.rows[0]) : null;
  }
  async revokeSession(id: string, now: Date, tx?: QueryExecutor): Promise<void> { await this.q(tx).query('UPDATE identity.sessions SET revoked_at=COALESCE(revoked_at,$2) WHERE id=$1', [id, now]); }
}

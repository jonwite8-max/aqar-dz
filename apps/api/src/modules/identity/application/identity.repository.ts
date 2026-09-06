import type { QueryExecutor } from '../../../infrastructure/database/query-executor';

export type SessionRecord = { id: string; userId: string; accessExpiresAt: Date; refreshExpiresAt: Date };

export abstract class IdentityRepository {
  abstract latestOtpCreatedAt(email: string, tx?: QueryExecutor): Promise<Date | null>;
  abstract createOtp(email: string, codeHash: string, expiresAt: Date, tx?: QueryExecutor): Promise<string>;
  abstract invalidateOtp(id: string, tx?: QueryExecutor): Promise<void>;
  abstract consumeOtp(email: string, codeHash: string, tx?: QueryExecutor): Promise<boolean>;
  abstract findUserIdByEmail(email: string, tx?: QueryExecutor): Promise<string | null>;
  abstract claimVerifiedEmail(userId: string, email: string, now: Date, tx: QueryExecutor): Promise<string>;
  abstract createSession(input: { userId: string; accessHash: string; refreshHash: string; accessExpiresAt: Date; refreshExpiresAt: Date; userAgentHash: string | null; ipHash: string | null; rotatedFromId: string | null }, tx?: QueryExecutor): Promise<SessionRecord>;
  abstract findByAccessHash(hash: string, tx?: QueryExecutor): Promise<SessionRecord | null>;
  abstract findByRefreshHash(hash: string, tx?: QueryExecutor): Promise<SessionRecord | null>;
  abstract revokeSession(id: string, now: Date, tx?: QueryExecutor): Promise<void>;
}

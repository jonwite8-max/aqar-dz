import { Injectable, TooManyRequestsException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import { AuthorizationService } from '../../authorization/application/authorization.service';
import type { UserRole } from '../../authorization/domain/authorization';
import { UsersService } from '../../users/application/users.service';
import type { User } from '../../users/domain/user';
import { IdentityRepository } from './identity.repository';
import { OtpDeliveryService } from '../infrastructure/otp-delivery.service';
import { ACCESS_TTL_MINUTES, OTP_RESEND_SECONDS, OTP_TTL_MINUTES, REFRESH_TTL_DAYS, expiresAfter, generateOpaqueToken, generateOtp, hashToken, hashWithPepper, normalizeEmail } from '../domain/auth-policy';

export type AuthenticatedActor = { user: User; roles: UserRole[] };
export type IssuedSession = { accessToken: string; refreshToken: string; accessExpiresAt: Date; refreshExpiresAt: Date };

function required(name: string): string { const value = process.env[name]; if (!value) throw new Error(`Missing required environment variable: ${name}`); return value; }
function contextHash(value: string | undefined): string | null { return value ? hashWithPepper(value, required('SECURITY_HASH_PEPPER')) : null; }

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly identities: IdentityRepository,
    private readonly users: UsersService,
    private readonly authorization: AuthorizationService,
    private readonly delivery: OtpDeliveryService,
  ) {}

  async requestEmailOtp(rawEmail: string): Promise<{ accepted: true; devCode: string | null }> {
    const email = normalizeEmail(rawEmail);
    const latest = await this.identities.latestOtpCreatedAt(email);
    if (latest && Date.now() - latest.getTime() < OTP_RESEND_SECONDS * 1000) throw new TooManyRequestsException('Please wait before requesting another code');
    const code = generateOtp();
    const hash = hashWithPepper(code, required('OTP_PEPPER'));
    const challengeId = await this.identities.createOtp(email, hash, expiresAfter(new Date(), OTP_TTL_MINUTES * 60_000));
    try {
      const result = await this.delivery.sendEmail(email, code);
      return { accepted: true, devCode: result.devCode };
    } catch (error) {
      await this.identities.invalidateOtp(challengeId);
      throw error;
    }
  }

  async verifyEmailOtp(rawEmail: string, code: string, context: { ip?: string; userAgent?: string }): Promise<{ actor: AuthenticatedActor; session: IssuedSession }> {
    const email = normalizeEmail(rawEmail);
    const codeHash = hashWithPepper(code, required('OTP_PEPPER'));
    return this.db.transaction(async (tx) => {
      if (!(await this.identities.consumeOtp(email, codeHash, tx))) throw new UnauthorizedException('Invalid or expired verification code');
      let userId = await this.identities.findUserIdByEmail(email, tx);
      if (!userId) {
        const created = await this.users.createForRegistration(tx);
        const claimedUserId = await this.identities.claimVerifiedEmail(created.id, email, new Date(), tx);
        if (claimedUserId !== created.id) await this.users.removeRegistrationStub(created.id, tx);
        else await this.authorization.grantDefaultRole(created.id, tx);
        userId = claimedUserId;
      }
      const now = new Date();
      await this.users.markLogin(userId, now, tx);
      const session = await this.issueSession(userId, context, null, tx);
      const actor = await this.loadActor(userId);
      return { actor, session };
    });
  }

  async authenticateAccess(accessToken: string): Promise<AuthenticatedActor> {
    const session = await this.identities.findByAccessHash(hashToken(accessToken));
    if (!session) throw new UnauthorizedException('Session expired');
    const actor = await this.loadActor(session.userId);
    if (actor.user.status !== 'active') throw new UnauthorizedException('Account is not active');
    await this.users.touchActivity(session.userId);
    return actor;
  }

  async rotateRefresh(refreshToken: string, context: { ip?: string; userAgent?: string }): Promise<IssuedSession> {
    return this.db.transaction(async (tx) => {
      const old = await this.identities.findByRefreshHash(hashToken(refreshToken), tx);
      if (!old) throw new UnauthorizedException('Refresh session expired');
      const now = new Date();
      await this.identities.revokeSession(old.id, now, tx);
      const next = await this.issueSession(old.userId, context, old.id, tx);
      await this.users.markLogin(old.userId, now, tx);
      return next;
    });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      const session = await this.identities.findByRefreshHash(hashToken(refreshToken), tx);
      if (session) await this.identities.revokeSession(session.id, new Date(), tx);
    });
  }

  private async issueSession(userId: string, context: { ip?: string; userAgent?: string }, rotatedFromId: string | null, tx: import('../../../infrastructure/database/query-executor').QueryExecutor): Promise<IssuedSession> {
    const now = new Date();
    const accessToken = generateOpaqueToken();
    const refreshToken = generateOpaqueToken();
    const accessExpiresAt = expiresAfter(now, ACCESS_TTL_MINUTES * 60_000);
    const refreshExpiresAt = expiresAfter(now, REFRESH_TTL_DAYS * 86_400_000);
    await this.identities.createSession({ userId, accessHash: hashToken(accessToken), refreshHash: hashToken(refreshToken), accessExpiresAt, refreshExpiresAt, userAgentHash: contextHash(context.userAgent), ipHash: contextHash(context.ip), rotatedFromId }, tx);
    return { accessToken, refreshToken, accessExpiresAt, refreshExpiresAt };
  }

  private async loadActor(userId: string): Promise<AuthenticatedActor> {
    const [user, roles] = await Promise.all([this.users.getById(userId), this.authorization.listRoles(userId)]);
    return { user, roles };
  }
}

export const LIFECYCLE_POLICY_VERSION = '2026-09-v1';
export const MEDIA_PRUNE_AFTER_DAYS = 7;
export const ACCOUNT_DELETE_AFTER_DAYS = 365;

export type LifecycleSubject = {
  lastLoginAt: Date;
  mediaPrunedAt?: Date | null;
  legalHold?: boolean;
};

export type LifecycleDecision = {
  inactiveDays: number;
  warnMediaPrune: boolean;
  pruneMedia: boolean;
  warnAccountDeletion30d: boolean;
  warnAccountDeletion7d: boolean;
  deleteAccount: boolean;
  blockedByLegalHold: boolean;
};

const DAY_MS = 86_400_000;

export function evaluateLifecycle(subject: LifecycleSubject, now = new Date()): LifecycleDecision {
  const inactiveDays = Math.max(0, Math.floor((now.getTime() - subject.lastLoginAt.getTime()) / DAY_MS));
  const blockedByLegalHold = subject.legalHold === true;

  return {
    inactiveDays,
    warnMediaPrune: !blockedByLegalHold && !subject.mediaPrunedAt && inactiveDays === MEDIA_PRUNE_AFTER_DAYS - 1,
    pruneMedia: !blockedByLegalHold && !subject.mediaPrunedAt && inactiveDays >= MEDIA_PRUNE_AFTER_DAYS,
    warnAccountDeletion30d: !blockedByLegalHold && inactiveDays >= 335 && inactiveDays < 358,
    warnAccountDeletion7d: !blockedByLegalHold && inactiveDays >= 358 && inactiveDays < ACCOUNT_DELETE_AFTER_DAYS,
    deleteAccount: !blockedByLegalHold && inactiveDays >= ACCOUNT_DELETE_AFTER_DAYS,
    blockedByLegalHold,
  };
}

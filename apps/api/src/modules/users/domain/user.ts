export type UserStatus = 'active' | 'suspended' | 'pending_deletion' | 'deleted';

export type User = {
  id: string;
  status: UserStatus;
  displayName: string | null;
  locale: string;
  lastLoginAt: Date | null;
  lastActiveAt: Date;
  mediaPrunedAt: Date | null;
  legalHold: boolean;
  createdAt: Date;
  deletedAt: Date | null;
};

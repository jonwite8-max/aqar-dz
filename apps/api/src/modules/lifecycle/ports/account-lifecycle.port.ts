export const ACCOUNT_LIFECYCLE_PORT = Symbol('ACCOUNT_LIFECYCLE_PORT');

export interface AccountLifecyclePort {
  markMediaPruned(userId: string, at: Date, policyVersion: string): Promise<void>;
  scheduleAccountDeletion(userId: string, at: Date, policyVersion: string): Promise<void>;
  deleteAccountProfileAndCredentials(userId: string, at: Date, policyVersion: string): Promise<void>;
}

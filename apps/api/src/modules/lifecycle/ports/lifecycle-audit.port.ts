export const LIFECYCLE_AUDIT_PORT = Symbol('LIFECYCLE_AUDIT_PORT');

export interface LifecycleAuditPort {
  record(event: {
    userId: string;
    action: 'media_pruned' | 'account_deletion_scheduled' | 'account_deleted';
    policyVersion: string;
    idempotencyKey: string;
    occurredAt: Date;
    metadata?: Record<string, unknown>;
  }): Promise<void>;
}

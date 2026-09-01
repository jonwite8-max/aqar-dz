export const MEDIA_RETENTION_PORT = Symbol('MEDIA_RETENTION_PORT');

export interface MediaRetentionPort {
  purgeUserListingMedia(userId: string, idempotencyKey: string): Promise<{ deletedObjects: number }>;
}

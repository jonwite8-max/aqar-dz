export const USER_ROLES = ['user','owner','agency_member','agency_manager','content_moderator','risk_moderator','admin','super_admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const PERMISSIONS = ['profile:read','profile:update','listing:publish','agency:manage','moderation:content','moderation:risk','admin:access'] as const;
export type Permission = (typeof PERMISSIONS)[number];

const grants: Record<UserRole, readonly Permission[]> = {
  user: ['profile:read','profile:update'],
  owner: ['profile:read','profile:update','listing:publish'],
  agency_member: ['profile:read','profile:update','listing:publish'],
  agency_manager: ['profile:read','profile:update','listing:publish','agency:manage'],
  content_moderator: ['profile:read','moderation:content'],
  risk_moderator: ['profile:read','moderation:risk'],
  admin: ['profile:read','moderation:content','moderation:risk','admin:access'],
  super_admin: [...PERMISSIONS],
};

export function roleAllows(role: UserRole, permission: Permission): boolean { return grants[role].includes(permission); }

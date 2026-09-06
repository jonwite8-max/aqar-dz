CREATE SCHEMA IF NOT EXISTS authorization;
CREATE TABLE IF NOT EXISTS authorization.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES accounts.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','owner','agency_member','agency_manager','content_moderator','risk_moderator','admin','super_admin')),
  scope_type text NOT NULL DEFAULT 'platform',
  scope_key text NOT NULL DEFAULT '*',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id,role,scope_type,scope_key)
);
CREATE INDEX IF NOT EXISTS user_roles_user_idx ON authorization.user_roles(user_id);

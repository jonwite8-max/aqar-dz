CREATE SCHEMA IF NOT EXISTS accounts;
CREATE TABLE IF NOT EXISTS accounts.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','pending_deletion','deleted')),
  display_name text,
  locale text NOT NULL DEFAULT 'ar-DZ',
  last_login_at timestamptz,
  last_active_at timestamptz NOT NULL DEFAULT now(),
  media_pruned_at timestamptz,
  deletion_warned_at timestamptz,
  deletion_scheduled_at timestamptz,
  legal_hold boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS users_lifecycle_idx ON accounts.users(status,last_active_at) WHERE deleted_at IS NULL;

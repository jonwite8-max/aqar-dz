CREATE SCHEMA IF NOT EXISTS identity;
CREATE TABLE IF NOT EXISTS identity.identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES accounts.users(id) ON DELETE CASCADE,
  identity_kind text NOT NULL CHECK (identity_kind IN ('email','phone')),
  normalized_value text NOT NULL,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(identity_kind,normalized_value)
);
CREATE INDEX IF NOT EXISTS identities_user_idx ON identity.identities(user_id);

CREATE TABLE IF NOT EXISTS identity.otp_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_kind text NOT NULL CHECK (identity_kind IN ('email','phone')),
  normalized_value text NOT NULL,
  code_hash text NOT NULL,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0 AND attempts <= 20),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS otp_lookup_idx ON identity.otp_challenges(identity_kind,normalized_value,created_at DESC);

CREATE TABLE IF NOT EXISTS identity.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES accounts.users(id) ON DELETE CASCADE,
  access_token_hash text NOT NULL UNIQUE,
  refresh_token_hash text NOT NULL UNIQUE,
  access_expires_at timestamptz NOT NULL,
  refresh_expires_at timestamptz NOT NULL,
  user_agent_hash text,
  ip_hash text,
  rotated_from_id uuid REFERENCES identity.sessions(id) ON DELETE SET NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_active_idx ON identity.sessions(user_id,refresh_expires_at) WHERE revoked_at IS NULL;

#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env.production ]; then
  echo "Missing .env.production" >&2
  exit 1
fi

set -a
. ./.env.production
set +a

BACKUP_DIR="${BACKUP_DIR:-/var/backups/aqar-dz/postgres}"
mkdir -p "$BACKUP_DIR"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="$BACKUP_DIR/aqar-$STAMP.dump"

docker compose --env-file .env.production -f infra/production/docker-compose.yml exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > "$FILE"

chmod 600 "$FILE"
echo "$FILE"

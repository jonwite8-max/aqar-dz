#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env.production ]; then
  echo "Missing .env.production. Copy .env.production.example and set real secrets." >&2
  exit 1
fi

COMPOSE="docker compose --env-file .env.production -f infra/production/docker-compose.yml"
$COMPOSE config >/dev/null
$COMPOSE build
$COMPOSE up -d

echo "Waiting for API health..."
tries=0
until curl -fsS "http://127.0.0.1/api/v1/health" >/dev/null 2>&1; do
  tries=$((tries + 1))
  if [ "$tries" -ge 30 ]; then
    echo "Health check failed after deployment." >&2
    $COMPOSE ps
    exit 1
  fi
  sleep 2
done

echo "Deployment healthy."

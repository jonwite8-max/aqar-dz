# Hostinger VPS deployment baseline

This is the server foundation, not the final GA runbook.

## Host requirements
- Ubuntu LTS VPS
- Docker Engine + Docker Compose plugin
- Git
- firewall allowing SSH, HTTP and HTTPS only
- domain DNS pointed to the VPS

## Layout
Recommended deployment root: `/opt/aqar-dz` owned by a dedicated deploy user. Keep `.env.production`, TLS keys, database backups and uploaded media outside Git history.

## First deployment
1. Clone the repository into `/opt/aqar-dz`.
2. Copy `.env.production.example` to `.env.production` and replace every secret.
3. Never reuse sample passwords from development.
4. Run `docker compose --env-file .env.production -f infra/production/docker-compose.yml config` and inspect the resolved configuration.
5. Build and start with `docker compose --env-file .env.production -f infra/production/docker-compose.yml up -d --build`.
6. Verify `/api/v1/health` and the Web root through Nginx.
7. Add HTTPS before public traffic. Certificate management is intentionally outside the application containers so the provider can change without rewriting the app.

## Security baseline
- PostgreSQL, Redis and Object Storage are not published to the Internet.
- Only Nginx is exposed publicly.
- `.env.production` must be mode 600 and excluded from Git.
- Administrative SSH should use keys and least privilege.
- Backups must be copied outside the VPS and restore-tested.

## Release rule
Production should deploy a tagged/approved commit, run health checks, and retain the previous known-good release for rollback. No manual edits inside running containers.

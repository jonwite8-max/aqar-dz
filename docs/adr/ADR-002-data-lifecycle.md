# ADR-002 — Inactivity lifecycle and storage retention

Status: Accepted for foundation v0.2.0

## Decision
A dedicated Lifecycle bounded module owns inactivity decisions. It does not own user rows or media objects. Deletion execution crosses module boundaries only through ports/events.

Thresholds for policy `2026-09-v1`:
- listing image/video pruning after 7 full days without a successful login;
- account deletion eligibility after 365 full days without a successful login;
- legal hold blocks automated deletion;
- warnings precede destructive actions;
- required audit, invoice, dispute and fraud-prevention evidence is handled under separate retention rules.

## Rationale
Embedding these rules in pages, Media, Identity or a VPS cron would create duplicate business logic and make later policy changes dangerous. A dedicated policy module makes thresholds versioned, testable and replaceable.

## Operational model
A future scheduler/worker will run a dry-run capable sweep, emit idempotent commands, collect metrics, and delegate execution to the owning modules. The scheduler is infrastructure; the policy remains domain code.

## Consequences
Returning users can keep their listing text and metadata but may need to upload media again after inactivity pruning. Account deletion is not equivalent to deleting legally required records; retained records must be minimized and separated from the live account.

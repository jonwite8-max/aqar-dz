# Component Ledger

| Component | Phase | Owner | State | Contracts/Data | Tests | Change record | Gate |
|---|---:|---|---|---|---|---|---|
| repository-foundation-v1 | 1 | Tech | Closed | workspace/config | structure + CI | ADR-001 / PR #1 | G5 |
| web-shell-v1 | 1 | Tech | Closed | route registry | routes smoke + build | PR #1 | G5 |
| api-shell-v1 | 1 | Tech | Closed | module registry | module smoke + build | PR #1 | G5 |
| vps-runtime-v1 | 1 | Tech | In Verification | Docker/Nginx/PostGIS/Redis/storage | CI + health | PR #2 | Staging VPS pending |
| lifecycle-policy-v1 | 1/2 | Tech | Closed | last_active_at policy contract | unit + invariants | PR #2/#3 | G5 policy only |
| identity-core-v1 | 2 | Tech | In Verification | accounts + identity schemas / auth API | unit + PostGIS E2E | PR #3 | G3 pending |
| authorization-core-v1 | 2 | Tech | In Verification | access_control.user_roles | unit + PostGIS E2E | PR #3 | G3 pending |
| identity-web-v1 | 2 | Tech | In Verification | /login + /account → auth API | build + E2E API | PR #3 | browser E2E pending |
| phone-otp-v1 | 2 | Tech | Planned | provider port | TBD | — | — |
| privileged-mfa-v1 | 2 | Tech | Planned | MFA policy | TBD | — | — |
| lifecycle-executor-v1 | 2/3 | Tech | Planned | lifecycle → notification/media/audit ports | TBD | — | — |
| property-listing-v1 | 3 | TBD | Planned | TBD | TBD | — | — |
| search-geo-v1 | 4 | TBD | Planned | TBD | TBD | — | — |

## قاعدة الإقفال
لا يتحول أي مكوّن إلى Closed حتى نجاح Unit/Integration/E2E/Regression المناسب، تحديث الوثائق، وخطة إزالة القديم إن وجد، ثم اعتماد G5. إقفال `lifecycle-policy-v1` يعني ثبات قرار المجال فقط؛ التنفيذ الذي يحذف media/account فعليًا يبقى مكوّنًا مستقلًا ولا يُعتبر مكتملًا قبل ربط التخزين والإشعارات والتدقيق.

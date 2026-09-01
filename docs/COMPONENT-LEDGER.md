# Component Ledger

| Component | Phase | Owner | State | Contracts/Data | Tests | Change record | Gate |
|---|---:|---|---|---|---|---|---|
| repository-foundation-v1 | 1 | Tech | In Verification | workspace/config | structure + CI | ADR-001 | G3 pending |
| web-shell-v1 | 1 | Tech | In Verification | route registry | routes smoke | foundation | G3 pending |
| api-shell-v1 | 1 | Tech | In Verification | module registry | module smoke | ADR-001 | G3 pending |
| identity-v1 | 2 | TBD | Planned | TBD | TBD | — | — |
| property-listing-v1 | 3 | TBD | Planned | TBD | TBD | — | — |
| search-geo-v1 | 4 | TBD | Planned | TBD | TBD | — | — |

## قاعدة الإقفال
لا يتحول أي مكوّن إلى Closed حتى نجاح Unit/Integration/E2E/Regression المناسب، تحديث الوثائق، وخطة إزالة القديم إن وجد، ثم اعتماد G5.

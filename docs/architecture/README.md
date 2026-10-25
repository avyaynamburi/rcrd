# Architecture docs (Codex writes these in P0-6)

- `data-model.md` — tables, relations, which carry `org_id` / `center_id`, views (patient balance), counters (voucher numbers).
- `permissions.md` — roles, presets, the access grid, how Same Day / own-records are evaluated, RLS helper functions.
- `actions.md` — the action-layer pattern every mutation follows, with one worked example.
- `ai.md` — provider interface, routing, tools, proposal format, confirm/undo flow.
- `messaging.md` — engine, triggers, scheduler, providers, credits.
- `privacy.md` — DPDP measures, consent records, data requests, retention, breach response.
- `decisions.md` — dated log of decisions on [DESIGN]/[CONFIRM] items and any spec deviations.

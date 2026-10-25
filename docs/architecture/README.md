# Architecture

P0-6 records the implementation contracts below. These are plans, not completed
application security or schema features; their code and tests ship in later phases.

- [Data model](data-model.md): tenancy, relationships, money, files and migrations.
- [Permissions](permissions.md): presets, day/ownership rules and RLS boundaries.
- [Actions](actions.md): validation, authorization, atomic writes and audit.
- [AI](ai.md): adapters, proposals, confirmation and privacy gates.
- [Messaging](messaging.md): log-only adapters, outbox, delivery and credits.
- [Privacy](privacy.md): consent, requests, retention and breach response.
- [Supabase](supabase.md): local and Mumbai hosted environments.
- [Deployment](deployment.md): PWA and preview deployment.
- [Decisions](decisions.md): dated choices and verification evidence.

Feature spec sections remain authoritative. An implementation must update these
contracts when it changes them, and document any spec deviation in decisions.

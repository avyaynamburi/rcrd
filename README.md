# Rcrd

Dental practice management for Indian clinics. Node.js 24 LTS and npm are required.

Run `npm ci`, then `npm run dev` and open http://localhost:3000. The initial workspace needs no secrets or database. The local Supabase workflow is documented in [the environment guide](docs/architecture/supabase.md); hosted provisioning remains an owner task.

- `npm run check`: ESLint, strict TypeScript, unit tests and formatting checks for application/tooling files.
- `npm run test:e2e`: production-build smoke tests in installed Chrome and Edge.
- `npm run build` / `npm start`: production build and local server.
- `npm run format`: format application/tooling files.

CI checks Ubuntu and runs browsers on Ubuntu Chrome and Windows Chrome/Edge. PWA installation and updates are available. The [preview pipeline](docs/architecture/deployment.md) needs owner-provided hosting secrets. Never use real patient data in development.

- `npm run db:start` / `npm run db:stop`: start/stop local Supabase (Docker required).
- `npm run db:reset`: apply local migrations and configured fake seeds.
- `npm run db:types`: safely regenerate local database TypeScript definitions.

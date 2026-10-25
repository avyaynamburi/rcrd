# Rcrd

Dental practice management for Indian clinics. Node.js 24 LTS and npm are required.

Run `npm ci`, then `npm run dev` and open http://localhost:3000. The initial workspace needs no secrets or database. Supabase integration follows in P0-2.

- `npm run check`: ESLint, strict TypeScript, unit tests and formatting checks for application/tooling files.
- `npm run test:e2e`: production-build smoke tests in installed Chrome and Edge.
- `npm run build` / `npm start`: production build and local server.
- `npm run format`: format application/tooling files.

CI checks Ubuntu and runs browsers on Ubuntu Chrome and Windows Chrome/Edge. Hosted deployment and PWA support follow in P0-4. Never use real patient data in development.

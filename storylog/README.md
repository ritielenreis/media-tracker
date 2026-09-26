## Storylog

Storylog is a Next.js app for tracking media entries across movies, series, books, and games.

The current MVP preserves the existing UI while persisting the library in PostgreSQL for a deterministic local development user.

## Local setup

1. Create a local environment file from `./.env.example`.
2. Set `DATABASE_URL` to a PostgreSQL database you can connect to locally.
3. Run the schema migration.
4. Start the app.

```bash
cp .env.example .env.local
npm install
npm run db:migrate
npm run dev
```

Open `http://localhost:3000`.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run db:migrate
npm run db:check
```

## Persistence notes

- PostgreSQL access lives in `infrastructure/persistence/`
- The `/` page loads persisted media for the local development user
- Submitting the existing Add Media sheet creates `Media` and `UserMedia` records
- The current UI `thoughts` field is stored on `user_media.thoughts` as the smallest user-specific extension needed to preserve existing behavior

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
npm run dev                # Start development server
npm run build              # Build for production
npm run start              # Run production server
npm run lint               # Run ESLint
npm run typecheck          # Run TypeScript type checking
npm run test               # Run E2E tests with Playwright
npm run db:migrate         # Apply database schema migrations
npm run db:check           # Validate database schema
```

## Testing

Storylog uses **Playwright** for end-to-end testing of the complete user journey:

```bash
npm test
```

Tests validate:
- Creating media through the UI
- API submission to `/api/media`
- Database persistence to PostgreSQL
- Page reload with server-side data loading
- All media types (movie, series, book, game)
- Form validation and submission state
- Optional fields (thoughts, rating)

For detailed testing documentation, see [`tests/README.md`](./tests/README.md).

### Quick Verification

```bash
npm run typecheck
npm run lint
npm run build
npm test
```

## Persistence notes

- PostgreSQL access lives in `infrastructure/persistence/`
- The `/` page loads persisted media for the local development user
- Submitting the existing Add Media sheet creates `Media` and `UserMedia` records
- The current UI `thoughts` field is stored on `user_media.thoughts` as the smallest user-specific extension needed to preserve existing behavior

# StoryLog Agent Guide

## Project

- StoryLog is a media tracking application for movies, series, books, and games.
- The product goal is a TV Time-style experience for multiple media types.
- The application should remain simple and incremental during MVP development.

## Current implementation state

- Next.js 16
- React 19
- TypeScript
- App Router
- Tailwind CSS v4
- shadcn/ui
- Base Luma preset
- Remixicon
- React state for the current prototype
- No database yet
- No authentication yet
- No external metadata providers yet
- No persistence yet

## Current MVP rules

- Current UI uses in-memory React state only.
- Data intentionally resets on refresh.
- Do not introduce PostgreSQL, Prisma, Supabase, API routes, server actions, authentication, Redis, external providers, or persistence unless explicitly requested.
- Do not add infrastructure just because it is planned for the future.
- Do not implement features outside the requested scope.

## Current media model

The current prototype supports:

- `movie`
- `series`
- `book`
- `game`

Current fields:

- `id`
- `title`
- `type`
- `description`
- `releaseDate`
- `rating`

Rules:

- `title` is required.
- `type` is required.
- `description` is optional.
- `releaseDate` is optional.
- `rating` is optional.
- Rating is an integer from 0 to 5.
- Media type must not have an implicit default.
- Use an explicit placeholder such as `Select media type`.

## UI rules

- Use the existing shadcn/ui design system.
- Reuse existing components before creating new abstractions.
- Prefer simple composition over unnecessary architecture.
- Keep state ownership clear.
- `MediaLibrary` owns the media collection and add-media sheet visibility.
- Child components should use controlled props/callbacks where appropriate.
- Do not introduce a state management library for the current MVP.
- Do not add image handling until explicitly requested.
- Current media cards use a text-based placeholder containing both title and media type.

## Scope discipline

Do not add:

- Search
- Filtering
- Delete
- Authentication
- Social features
- Notifications
- External metadata providers
- Image providers
- Database persistence
- Analytics
- Advanced routing

unless the task explicitly requires them.

## Architecture principles

- Keep UI concerns separate from domain logic as the project grows.
- Prefer small, composable components.
- Avoid speculative abstractions.
- Prefer TypeScript types shared between related components.
- Keep external integrations behind clear boundaries when they are eventually introduced.
- Preserve the ability to evolve the prototype into the planned production architecture without implementing that architecture prematurely.

## Planned architecture

This section is future direction only, not current implementation.

- PostgreSQL for persistent data.
- Supabase for hosted PostgreSQL/Auth/RLS.
- External metadata providers such as TMDB, Open Library/Google Books, and RAWG.
- Unified media search.
- User-specific tracking through a `UserMedia` relationship.
- Vercel for application hosting.
- GitHub Actions for CI/CD.

## Coding conventions

- Use TypeScript.
- Prefer functional React components.
- Prefer modern Next.js App Router patterns.
- Keep client components limited to places that actually require client-side interactivity.
- Avoid `any`.
- Keep components focused.
- Prefer accessible semantic HTML and accessible form controls.
- Run the project's available lint, typecheck, and build validation after meaningful changes.

## Git conventions

- Use Conventional Commits with the format `<type>(<scope>): <description>`.
- Keep commit messages concise and imperative.
- Use appropriate types such as `feat`, `fix`, `refactor`, `docs`, `test`, and `chore`.
- Scope is optional and should be used when it adds clarity.

## Commit Strategy

- Commit changes in logical, independently reviewable units.
- Keep unrelated features or fixes in separate commits.
- Prefer one commit per feature or coherent change.
- Do not combine unrelated UI, documentation, refactoring, and bug fixes into a single commit.
- Use Conventional Commits following the existing Git convention.
- Before committing, review the diff and ensure only the intended changes are included.
- Do not create commits automatically unless explicitly asked.

Examples:

- `feat(media): add title creation sheet`
- `fix(form): prevent empty media type submission`
- `refactor(cards): simplify media placeholder layout`
- `docs(product): clarify MVP scope`
- `test(media): cover add title interaction`
- `chore(ui): install shadcn sheet component`
- `feat(ui): add title creation form`
- `feat(ui): add star rating`
- `docs: update architecture`
- `fix(ui): improve form spacing`

## Git Workflow

- Use trunk-based development.
- `main` is the default and primary branch.
- All development work must be done on a dedicated short-lived branch.
- Never make development changes directly on `main`.
- Branches should be focused and merged back into `main` promptly.
- Avoid long-lived feature branches.

### Branch naming

Use:

`<type>/<short-kebab-case-description>`

Allowed types:

- `feature/` for new functionality
- `fix/` for bug fixes
- `refactor/` for code restructuring
- `docs/` for documentation
- `chore/` for maintenance

Examples:

- `feature/add-title-form`
- `feature/star-rating`
- `fix/form-validation`
- `refactor/media-components`
- `docs/update-architecture`
- `chore/update-dependencies`

### Commits

- Use Conventional Commits.
- Keep commits small and logically focused.
- Separate unrelated features, fixes, documentation, and refactors into different commits.
- Review the diff before committing.
- Do not create commits automatically unless explicitly asked.

## Agent behavior

Before implementing:

1. Inspect the existing project structure.
2. Read `AGENTS.md`.
3. Reuse existing components and conventions.
4. Identify the smallest implementation that satisfies the request.
5. Do not introduce dependencies or infrastructure without justification.

After implementing:

1. Review the diff.
2. Remove unnecessary complexity.
3. Run relevant validation.
4. Report what changed and any limitations.

Do not rewrite unrelated code.

# Development Guide

## Requirements

- Node.js
- pnpm

## Running locally

Current package scripts in `storylog/package.json`:

- `npm run dev` — start the Next.js development server
- `npm run build` — create a production build
- `npm run start` — run the production server
- `npm run lint` — run ESLint
- `npm run format` — run Prettier for `ts` and `tsx` files
- `npm run typecheck` — run TypeScript without emitting files

## Project structure

Current application structure:

- `storylog/app` — App Router entrypoints, layout, and global styles
- `storylog/components` — app-specific components and UI wrappers
- `storylog/components/ui` — shadcn/ui components
- `storylog/types` — shared TypeScript types for the prototype
- `storylog/lib` — shared utilities
- `storylog/public` — static assets

Current key files:

- `storylog/app/page.tsx` — renders the `MediaLibrary` view
- `storylog/app/layout.tsx` — root layout, fonts, and theme provider wiring
- `storylog/components/media-library.tsx` — top-level state owner for the current prototype
- `storylog/components/media-form.tsx` — add-media form and validation
- `storylog/types/media.ts` — current media type definitions

## Development principles

- Keep changes focused.
- Prefer existing shadcn/ui components.
- Avoid unnecessary dependencies.
- Keep client-side state local until persistence is required.
- Keep future architecture out of the current prototype.

## Pull Request Workflow

- The project is managed in GitHub.
- All changes must be merged into `main` through a Pull Request.
- PRs should come from short-lived branches following the project's branch naming convention.
- Keep PRs small and focused on a single logical change.
- PR titles should follow Conventional Commits.
- PR descriptions should clearly explain what changed and why.
- Do not merge unrelated changes into the same PR.
- Keep `main` in a releasable state.

## Validation

Available validation commands from `storylog/package.json`:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

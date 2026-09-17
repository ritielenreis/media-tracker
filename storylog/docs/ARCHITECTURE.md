# Architecture

## Current state

Browser
→ Next.js App Router
→ React components
→ In-memory React state

The current StoryLog prototype uses:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui with the Base Luma preset
- Remixicon

Current component structure centers on a small client-side UI flow:

- `MediaLibrary` owns the in-memory media collection and add-media sheet visibility.
- `AddMediaSheet` renders the shadcn `Sheet` used for the create flow.
- `MediaForm` manages the add-media form state and validation.
- `MediaGrid` renders the responsive grid of items.
- `MediaCard` renders each media item with a text-based placeholder.

## Current data flow

`User → Add Media → Form → Media object → MediaLibrary state → Media Grid → Media Card`

The current implementation is intentionally transient. Data exists only in React state and resets on refresh.

## Future direction

This section describes planned architecture only. It is not implemented today.

- PostgreSQL
- A `User` / `UserMedia` / `Media` model
- A metadata provider gateway
- Unified search
- Supabase
- Authentication and RLS
- Vercel
- GitHub Actions

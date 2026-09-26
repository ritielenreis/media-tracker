import "server-only"

import type { Media } from "@/domain/media"
import { getPool, type DatabaseClient } from "./db"

export type UserMediaStatus = "planned" | "in_progress" | "completed" | "dropped"

interface InsertUserMediaInput {
  userId: string
  mediaId: string
  status: UserMediaStatus
  thoughts?: string
  rating?: number
  startedAt: Date | null
  completedAt: Date | null
}

interface LibraryMediaRow {
  id: string
  title: string
  type: Media["type"]
  thoughts: string | null
  rating: number | null
}

export async function insertUserMedia(
  client: DatabaseClient,
  input: InsertUserMediaInput
) {
  await client.query(
    `
      INSERT INTO user_media (
        user_id,
        media_id,
        status,
        thoughts,
        rating,
        started_at,
        completed_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      input.userId,
      input.mediaId,
      input.status,
      input.thoughts ?? null,
      input.rating ?? null,
      input.startedAt,
      input.completedAt,
    ]
  )
}

export async function listUserLibraryMedia(
  userId: string,
  client: DatabaseClient = getPool()
): Promise<Media[]> {
  const result = await client.query<LibraryMediaRow>(
    `
      SELECT
        media.id,
        media.title,
        media.type,
        user_media.thoughts,
        user_media.rating::float8 AS rating
      FROM user_media
      INNER JOIN media ON media.id = user_media.media_id
      WHERE user_media.user_id = $1
      ORDER BY user_media.created_at DESC
    `,
    [userId]
  )

  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type,
    ...(row.thoughts ? { thoughts: row.thoughts } : {}),
    ...(row.rating !== null ? { rating: row.rating } : {}),
  }))
}

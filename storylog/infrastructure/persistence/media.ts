import "server-only"

import type { MediaType } from "@/domain/media"
import type { DatabaseClient } from "./db"

interface InsertMediaInput {
  id: string
  title: string
  description: string | null
  type: MediaType
  releaseDate: string | null
  coverUrl: string | null
}

export async function insertMedia(
  client: DatabaseClient,
  input: InsertMediaInput
) {
  await client.query(
    `
      INSERT INTO media (id, title, description, type, release_date, cover_url)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      input.id,
      input.title,
      input.description,
      input.type,
      input.releaseDate,
      input.coverUrl,
    ]
  )
}

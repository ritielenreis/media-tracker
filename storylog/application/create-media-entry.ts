import "server-only"

import { randomUUID } from "node:crypto"

import {
  mediaTypes,
  type Media,
  type MediaDraft,
  type MediaType,
  validateMediaDraft,
} from "@/domain/media"
import { withTransaction } from "@/infrastructure/persistence/db"
import { insertMedia } from "@/infrastructure/persistence/media"
import {
  insertUserMedia,
  type UserMediaStatus,
} from "@/infrastructure/persistence/user-media"
import { ensureDevelopmentUser } from "@/infrastructure/persistence/users"

interface RawMediaDraft {
  title?: unknown
  type?: unknown
  thoughts?: unknown
  rating?: unknown
}

function parseMediaDraft(input: unknown): MediaDraft {
  const raw = (input ?? {}) as RawMediaDraft
  const title = typeof raw.title === "string" ? raw.title.trim() : ""
  const parsedType =
    typeof raw.type === "string" && mediaTypes.includes(raw.type as MediaType)
      ? (raw.type as MediaType)
      : ""
  const thoughts =
    typeof raw.thoughts === "string" && raw.thoughts.trim().length > 0
      ? raw.thoughts.trim()
      : undefined
  const rating = typeof raw.rating === "number" ? raw.rating : undefined

  const errors = validateMediaDraft({ title, type: parsedType, rating })

  if (Object.keys(errors).length > 0) {
    throw new Error("Invalid media draft")
  }

  return {
    title,
    type: parsedType as MediaType,
    ...(thoughts ? { thoughts } : {}),
    ...(rating !== undefined ? { rating } : {}),
  }
}

function resolveStatus(input: MediaDraft): UserMediaStatus {
  if (input.rating !== undefined || input.thoughts) {
    return "completed"
  }

  return "planned"
}

export async function createMediaEntry(input: unknown): Promise<Media> {
  const mediaDraft = parseMediaDraft(input)

  return withTransaction(async (client) => {
    const user = await ensureDevelopmentUser(client)
    const mediaId = randomUUID()
    const status = resolveStatus(mediaDraft)

    await insertMedia(client, {
      id: mediaId,
      title: mediaDraft.title,
      description: null,
      type: mediaDraft.type,
      releaseDate: null,
      coverUrl: null,
    })

    await insertUserMedia(client, {
      userId: user.id,
      mediaId,
      status,
      ...(mediaDraft.thoughts ? { thoughts: mediaDraft.thoughts } : {}),
      ...(mediaDraft.rating !== undefined ? { rating: mediaDraft.rating } : {}),
      startedAt: null,
      completedAt: status === "completed" ? new Date() : null,
    })

    return {
      id: mediaId,
      ...mediaDraft,
    }
  })
}

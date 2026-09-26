export const mediaTypes = ["movie", "series", "book", "game"] as const

export type MediaType = (typeof mediaTypes)[number]

export interface MediaDraft {
  title: string
  type: MediaType
  thoughts?: string
  rating?: number
}

export interface Media extends MediaDraft {
  id: string
}

export interface MediaValidationErrors {
  title?: string
  type?: string
  rating?: string
}

export function validateMediaDraft(input: {
  title: string
  type: MediaType | ""
  rating?: number
}): MediaValidationErrors {
  const errors: MediaValidationErrors = {}

  if (!input.title.trim()) {
    errors.title = "Title is required"
  }

  if (!input.type) {
    errors.type = "Media type is required"
  }

  if (
    input.rating !== undefined &&
    (!Number.isInteger(input.rating) || input.rating < 0 || input.rating > 5)
  ) {
    errors.rating = "Rating must be a number between 0 and 5"
  }

  return errors
}

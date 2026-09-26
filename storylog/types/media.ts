export type MediaType = "movie" | "series" | "book" | "game"

export interface Media {
  id: string
  title: string
  type: MediaType
  thoughts?: string
  rating?: number
}

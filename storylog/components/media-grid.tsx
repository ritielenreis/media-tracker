import { MediaCard } from "./media-card"
import type { Media } from "@/types/media"

interface MediaGridProps {
  media: Media[]
}

export function MediaGrid({ media }: MediaGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {media.map((item) => (
        <MediaCard key={item.id} media={item} />
      ))}
    </div>
  )
}

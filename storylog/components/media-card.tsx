import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { RiStarFill, RiStarLine } from "@remixicon/react"
import type { Media } from "@/types/media"

interface MediaCardProps {
  media: Media
}

const mediaTypeLabels: Record<Media["type"], string> = {
  movie: "Movie",
  series: "Series",
  book: "Book",
  game: "Game",
}

export function MediaCard({ media }: MediaCardProps) {
  const rating = media.rating

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-muted to-muted/50 px-6 py-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-sm font-medium text-muted-foreground">
            {mediaTypeLabels[media.type]}
          </div>
          <h3 className="line-clamp-3 text-lg font-semibold leading-tight">
            {media.title}
          </h3>
        </div>
      </div>

      <div className="space-y-3 border-t border-border px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-2 font-medium">{media.title}</h4>
          <Badge variant="secondary" className="shrink-0">
            {mediaTypeLabels[media.type]}
          </Badge>
        </div>

        {media.thoughts && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {media.thoughts}
          </p>
        )}

        {rating !== undefined ? (
          <div className="flex items-center gap-1 text-primary" aria-label={`Rated ${rating} out of 5`}>
            {Array.from({ length: 5 }, (_, index) =>
              index < rating ? (
                <RiStarFill key={index} className="size-4 fill-current" />
              ) : (
                <RiStarLine key={index} className="size-4 text-muted-foreground" />
              )
            )}
          </div>
        ) : null}
      </div>
    </Card>
  )
}

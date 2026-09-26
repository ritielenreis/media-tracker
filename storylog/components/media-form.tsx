"use client"

import * as React from "react"
import { RiStarFill, RiStarLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type Media,
  type MediaType,
  type MediaValidationErrors,
  validateMediaDraft,
} from "@/domain/media"

interface MediaFormProps {
  onSubmit: (media: Omit<Media, "id">) => Promise<void> | void
  onReset?: () => void
}

// Memoized star rating component
const StarRating = React.memo(
  ({
    rating,
    errors,
    onRatingChange,
  }: {
    rating: number | undefined
    errors: MediaValidationErrors
    onRatingChange: (value: number) => void
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-sm font-medium">Rating</label>
        {rating !== undefined ? (
          <button
            type="button"
            onClick={() => onRatingChange(0)}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div
        id="rating"
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="Rating"
      >
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1
          const isActive = (rating ?? 0) >= value

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              onClick={() => onRatingChange(value)}
              className="rounded-full p-1 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {isActive ? (
                <RiStarFill className="size-6 fill-current text-primary" />
              ) : (
                <RiStarLine className="size-6" />
              )}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Optional. Choose a rating from 1 to 5 stars.
      </p>
      {errors.rating && (
        <p className="text-xs text-destructive">{errors.rating}</p>
      )}
    </div>
  )
)

StarRating.displayName = "StarRating"

export function MediaForm({ onSubmit, onReset }: MediaFormProps) {
  const [title, setTitle] = React.useState("")
  const [type, setType] = React.useState<MediaType | "">("")
  const [thoughts, setThoughts] = React.useState("")
  const [rating, setRating] = React.useState<number | undefined>(undefined)
  const [errors, setErrors] = React.useState<MediaValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const validateForm = React.useCallback(() => {
    const newErrors = validateMediaDraft({ title, type, rating })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [title, type, rating])

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) {
        return
      }

      const newMedia: Omit<Media, "id"> = {
        title: title.trim(),
        type: type as MediaType,
        ...(thoughts.trim() && { thoughts: thoughts.trim() }),
        ...(rating !== undefined && { rating }),
      }

      try {
        setIsSubmitting(true)
        await onSubmit(newMedia)

        setTitle("")
        setType("")
        setThoughts("")
        setRating(undefined)
        setErrors({})

        onReset?.()
      } finally {
        setIsSubmitting(false)
      }
    },
    [validateForm, title, type, thoughts, rating, onSubmit, onReset]
  )

  const handleRatingChange = React.useCallback((value: number) => {
    setRating(value === 0 ? undefined : value)
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Title *
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter media title"
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="type" className="block text-sm font-medium">
          Type *
        </label>
        <Select value={type} onValueChange={(value) => setType(value as MediaType)}>
          <SelectTrigger
            id="type"
            className={errors.type ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Select media type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="movie">Movie</SelectItem>
            <SelectItem value="series">Series</SelectItem>
            <SelectItem value="book">Book</SelectItem>
            <SelectItem value="game">Game</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="mt-1 text-xs text-destructive">{errors.type}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="thoughts" className="block text-sm font-medium">
          Thoughts
        </label>
        <Textarea
          id="thoughts"
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          placeholder="Add any quick thoughts (optional)"
          className="resize-none"
          rows={4}
        />
      </div>

      <StarRating
        rating={rating}
        errors={errors}
        onRatingChange={handleRatingChange}
      />

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          Add Title
        </Button>
      </div>
    </form>
  )
}

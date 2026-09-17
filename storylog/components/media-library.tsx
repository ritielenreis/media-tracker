"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { AddMediaSheet } from "./add-media-sheet"
import { EmptyLibraryState } from "./empty-library-state"
import { MediaGrid } from "./media-grid"
import type { Media } from "@/types/media"

export function MediaLibrary() {
  const [media, setMedia] = React.useState<Media[]>([])
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  const handleAddMedia = (newMedia: Omit<Media, "id">) => {
    const mediaWithId: Media = {
      ...newMedia,
      id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setMedia((prev) => [mediaWithId, ...prev])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">StoryLog</h1>
            <p className="text-sm text-muted-foreground">
              Track your favorite media
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="px-6 py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Media</h2>
            <Button onClick={() => setIsSheetOpen(true)}>Add Media</Button>
          </div>

          {/* Content */}
          {media.length === 0 ? (
            <EmptyLibraryState onAddMedia={() => setIsSheetOpen(true)} />
          ) : (
            <MediaGrid media={media} />
          )}
        </div>
      </main>

      {/* Add Media Sheet */}
      <AddMediaSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onAddMedia={handleAddMedia}
      />
    </div>
  )
}

"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Media } from "@/domain/media"
import { MediaForm } from "./media-form"

interface AddMediaSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddMedia: (media: Omit<Media, "id">) => Promise<void>
}

export function AddMediaSheet({
  isOpen,
  onOpenChange,
  onAddMedia,
}: AddMediaSheetProps) {
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (media: Omit<Media, "id">) => {
    setError(null)
    setSuccess(false)
    
    try {
      await onAddMedia(media)
      setSuccess(true)
      // Close after a short delay to show success message
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add media")
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Title</SheetTitle>
          <SheetDescription>
            Add a new title to your media library
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700">
              ✓ Title added successfully! Closing...
            </div>
          )}
          <MediaForm
            onSubmit={handleSubmit}
            onReset={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

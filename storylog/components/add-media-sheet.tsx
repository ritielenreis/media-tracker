"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { MediaForm } from "./media-form"
import type { Media } from "@/types/media"

interface AddMediaSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddMedia: (media: Omit<Media, "id">) => void
}

export function AddMediaSheet({
  isOpen,
  onOpenChange,
  onAddMedia,
}: AddMediaSheetProps) {
  const handleSubmit = (media: Omit<Media, "id">) => {
    onAddMedia(media)
    onOpenChange(false)
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
        <div className="mt-6">
          <MediaForm
            onSubmit={handleSubmit}
            onReset={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

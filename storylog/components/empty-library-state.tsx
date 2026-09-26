import { Button } from "@/components/ui/button"

interface EmptyLibraryStateProps {
  onAddMedia: () => void
}

export function EmptyLibraryState({ onAddMedia }: EmptyLibraryStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">No media added yet</h3>
        <p className="text-sm text-muted-foreground">
          Start building your library by adding your first item
        </p>
      </div>
      <Button onClick={onAddMedia}>Add Your First Media</Button>
    </div>
  )
}

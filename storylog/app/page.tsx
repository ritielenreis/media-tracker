import { listMediaLibrary } from "@/application/list-media-library"
import { MediaLibrary } from "@/components/media-library"
import type { Media } from "@/domain/media"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function Page() {
  let initialMedia: Media[] = []
  
  try {
    initialMedia = await listMediaLibrary()
  } catch (error) {
    console.error("Failed to load media library:", error)
  }

  return <MediaLibrary initialMedia={initialMedia} />
}

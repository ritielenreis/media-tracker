import "server-only"

import type { Media } from "@/domain/media"
import { listUserLibraryMedia } from "@/infrastructure/persistence/user-media"
import { ensureDevelopmentUser } from "@/infrastructure/persistence/users"

export async function listMediaLibrary(): Promise<Media[]> {
  const user = await ensureDevelopmentUser()
  return listUserLibraryMedia(user.id)
}

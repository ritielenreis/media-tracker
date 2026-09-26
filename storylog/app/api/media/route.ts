import { NextResponse } from "next/server"

import { createMediaEntry } from "@/application/create-media-entry"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const input = await request.json()
    const media = await createMediaEntry(input)

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create media entry"
    const status = message === "Invalid media draft" ? 400 : 500

    return NextResponse.json({ error: message }, { status })
  }
}
